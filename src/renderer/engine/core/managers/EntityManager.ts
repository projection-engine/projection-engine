import AbstractSingleton from "../AbstractSingleton";
import DynamicMap from "../lib/DynamicMap";
import Component from "@engine-core/lib/components/Component";
import getComponentInstance from "../utils/get-component-instance";
import serializeStructure from "../utils/serialize-structure";
import {Components} from "../engine.enum";
import {vec3} from "gl-matrix";
import LightsManager from "@engine-core/managers/LightsManager";
import PickingUtil from "@engine-core/utils/PickingUtil";

export default class EntityManager extends AbstractSingleton {
    #listeners = new DynamicMap<EntityEventTypes, EntityManagerListener<EngineEntity, Components>[]>
    #entities = new DynamicMap<EngineEntity, DynamicMap<Components, Component>>()
    #childParent = new Map<EngineEntity, EngineEntity>()
    #parentChildren = new Map<EngineEntity, EngineEntity[]>()
    #activeEntities = new Map<EngineEntity, boolean>()
    #pickInteger = new Map<number, EngineEntity>
    #pickVec3 = new Map<EngineEntity, vec3>
    #byComponent = new Map<Components, DynamicMap<EngineEntity, EngineEntity>>()
    static #preventDefaultTrigger = false

    constructor() {
        super();
        this.#listeners.set("component-add", [])
        this.#listeners.set("component-remove", [])
        this.#listeners.set("create", [])
        this.#listeners.set("delete", [])
        this.#listeners.set("update", [])
        Object.values(Components).forEach(c => this.#byComponent.set(c as Components, new DynamicMap<EngineEntity, EngineEntity>()))
    }

    static getInstance(): EntityManager {
        return super.get<EntityManager>()
    }

    /**
     * OBS: hard-change type will be triggered only for "component-add", "component-remove", "create" and "delete" event types
     * @returns removeListener method
     */
    static addEventListener(type: EntityEventTypes, callback: GenericVoidFunctionWithP<EntityListenerEvent<EngineEntity, Components>>, options?: EntityListenerOptions): GenericVoidFunction {
        if (type === "hard-change") {
            const toRemove = [
                this.addEventListener("component-add", callback, options),
                this.addEventListener("component-remove", callback, options),
                this.addEventListener("create", callback, options),
                this.addEventListener("delete", callback, options)
            ]
            return () => toRemove.forEach(f => f())
        } else {
            let remove: VoidFunction
            const targets: EntityManagerListener<EngineEntity, Components>[] = EntityManager.getInstance().#listeners.get(type)
            const onceCallback = (e: EntityListenerEvent<EngineEntity, Components>) => {
                callback(e)
                remove()
            }
            const index = targets.push({callback: options?.once ? onceCallback : callback, options}) - 1
            remove = () => targets.splice(index, 1)
            return remove
        }
    }

    static loopHierarchy(entity: EngineEntity, callback: GenericVoidFunctionWithP<EngineEntity>) {
        const children = EntityManager.getChildren(entity)
        callback(entity)
        for (let i = 0; i < children.length; i++) {
            const current = children[i]
            EntityManager.loopHierarchy(current, callback)
        }
    }

    static getEntities() {
        return this.getInstance().#entities
    }

    static getEntityKeys(): EngineEntity [] {
        return Array.from(this.getInstance().#entities.keys())
    }

    static getEntityPickVec3(entity: EngineEntity): vec3 | undefined {
        const instance = this.getInstance()
        if (!instance.#pickVec3.has(entity) && this.entityExists(entity) && (this.hasAllComponents(entity, Components.TRANSFORMATION, Components.MESH) || this.hasAllComponents(entity, Components.TRANSFORMATION, Components.SPRITE))) {
            const index = instance.#pickInteger.size
            instance.#pickVec3.set(entity, PickingUtil.getPickerId(index) as vec3)
            instance.#pickInteger.set(index, entity)
        }
        return instance.#pickVec3.get(entity)
    }

    static getEntityWithPickIndex(index: number): EngineEntity | undefined {
        return this.getInstance().#pickInteger.get(index)
    }

    static getState() {
        return {
            entities: this.getEntities(),
            childParent: EntityManager.getInstance().#childParent,
            parentChildren: EntityManager.getInstance().#parentChildren
        }
    }

    static toggleEntityActiveState(entity: EngineEntity) {
        const original = this.getActiveEntities().get(entity)
        this.#enableDisableEntityInternal([entity], !original)
        if (this.hasComponent(entity, Components.LIGHT) || this.hasComponent(entity, Components.ATMOSPHERE)) {
            LightsManager.packageLights(false, true)
        }
    }

    static #enableDisableEntityInternal(entities: EngineEntity[], state: boolean) {
        const collected: EngineEntity[] = []
        const activeEntities = this.getActiveEntities()
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            collected.push(...this.getChildren(entity))
            activeEntities.set(entity, state)
        }
        this.clearPickingCache()
        if (collected.length > 0) {
            this.#enableDisableEntityInternal(collected, state)
        }
    }

    static isEntityEnabled(entity: EngineEntity): boolean {
        return this.getActiveEntities().get(entity)
    }

    static getChildren(entity: EngineEntity): EngineEntity[] {
        return EntityManager.getInstance().#parentChildren.get(entity) || []
    }

    static getParent(entity: EngineEntity): EngineEntity | undefined {
        return EntityManager.getInstance().#childParent.get(entity)
    }

    static hasParent(entity: EngineEntity): boolean {
        return EntityManager.getInstance().#childParent.has(entity)
    }

    static addParent(child: EngineEntity, parent: EngineEntity | undefined) {
        const prevParent = this.getParent(child)
        const ins = this.getInstance()
        ins.#childParent.set(child, parent)
        if (prevParent) {
            const parentArr = ins.#parentChildren.get(prevParent) || []
            EntityManager.getInstance().#parentChildren.set(prevParent, parentArr.filter(e => e === child))
        }
        if (parent) {
            const parentArr = ins.#parentChildren.get(parent) || []
            if (!parentArr.includes(child))
                parentArr.push(child)
            EntityManager.getInstance().#parentChildren.set(parent, parentArr)
        }
        this.#callListeners({type: "hierarchy-change"})
    }

    static addChildren(parent: EngineEntity, children: EngineEntity[]) {
        const ins = EntityManager.getInstance()
        const parentArr = ins.#parentChildren.get(parent) || []
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const prevParent = this.getParent(child)
            ins.#childParent.set(child, parent)
            if (prevParent) {
                const parentArr = ins.#parentChildren.get(prevParent) || []
                EntityManager.getInstance().#parentChildren.set(prevParent, parentArr.filter(e => e === child))
            }
        }
        this.clearPickingCache()
        ins.#parentChildren.set(parent, Array.from(new Set([...parentArr, ...children])))
    }

    static getComponent<T>(entity: EngineEntity, component: Components): T | undefined {
        if (!entity)
            return
        return this.getEntities().get(entity)?.get?.(component) as T
    }

    static clone(entity: EngineEntity, targetId?: EngineEntity) {
        const id = targetId ?? crypto.randomUUID()
        const str = serializeStructure({id, components: Array.from(this.getEntities().get(entity).entries())})
        this.parseEntity(JSON.parse(str))
        this.clearPickingCache()
        return id
    }

    static updateProperty(entity: EngineEntity, component: Components, key: string, value: any) {
        this.getEntities().get(entity).get(component)[key] = value
        this.#callListeners({target: entity, all: [entity], type: "update", targetComponents: [component]})
    }

    static updateProperties(entity: EngineEntity, component: Components, properties: MutableObject) {
        const entries = Object.entries(properties)
        const componentInstance = this.getEntities().get(entity).get(component)
        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            componentInstance[key] = value
        }
        this.#callListeners({target: entity, all: [entity], type: "update", targetComponents: [component]})
    }

    static createEntitiesById(entities: EngineEntity[]): EngineEntity[] {
        const activeEntities = this.getActiveEntities()
        for (let i = 0; i < entities.length; i++) {
            const newEntity = entities[i]
            entities.push(newEntity)
            activeEntities.set(newEntity, true)
            this.getEntities().set(newEntity, new DynamicMap<Components, Component>())
        }
        this.clearPickingCache()
        this.#callListeners({all: entities, type: "create"})
        return entities
    }

    static removeEntities(entities: EngineEntity[]) {
        const removed = {}
        const allRemoved = []
        this.#removeEntitiesInternal(entities, removed, allRemoved)
        this.clearPickingCache()
        this.#callListeners({all: allRemoved, type: "delete"})
    }

    static #removeEntitiesInternal(entities: EngineEntity[], removed: TypedObject<boolean>, allRemoved: EngineEntity[]) {
        const collected: EngineEntity[] = []
        const activeEntities = this.getActiveEntities()
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            this.getEntities().delete(entity);
            activeEntities.delete(entity)
            if (!removed[entity]) {
                const parentEntity = EntityManager.getInstance().#childParent.get(entity)
                const parentDeps = EntityManager.getInstance().#parentChildren.get(parentEntity)
                if (parentDeps) {
                    removed[entity] = true
                    EntityManager.getInstance().#parentChildren.set(parentEntity, parentDeps.filter(e => e !== entity))
                }
            }
            collected.push(...this.getChildren(entity))
            allRemoved.push(entity)
        }
        if (collected.length > 0) {
            this.#removeEntitiesInternal(collected, removed, allRemoved)
        }
    }

    static addComponent(target: EngineEntity, componentType: Components): Component {
        const allAdded: Component[] = []
        this.#addComponentInternal(target, componentType, allAdded)
        this.#callListeners({
            target,
            all: [target],
            type: "component-add",
            targetComponents: allAdded.map(e => e.getComponentKey())
        })
        return allAdded[0]
    }

    static #addComponentInternal(target: EngineEntity, componentType: Components, allAdded: Component[]) {
        const targetMap = this.getEntities().get(target)
        if (!targetMap.has(componentType)) {
            const newInstance = getComponentInstance(target, componentType)
            targetMap.set(componentType, newInstance)
            allAdded.push(newInstance)
        }
        targetMap.get(componentType).getDependencies().forEach(c => {
            this.#addComponentInternal(target, c, allAdded)
        })
    }

    static removeComponent(target: EngineEntity, componentType: Components) {
        const allRemoved: Components[] = []
        this.#removeComponentInternal(target, componentType, allRemoved)
        this.#callListeners({
            target: target,
            all: [target],
            type: "component-remove",
            targetComponents: allRemoved
        })
    }

    static #removeComponentInternal(target: EngineEntity, componentType: Components, allRemoved: Components[]) {
        const targetMap = this.getEntities().get(target)
        const instance = targetMap.get(componentType)
        const componentsToRemove: Components[] = []
        if (instance != null) {
            targetMap.array.forEach(component => {
                if (component.getDependencies().includes(componentType)) {
                    componentsToRemove.push(component.getComponentKey())
                }
            })
            targetMap.delete(componentType)
            allRemoved.push(componentType)
        }
        componentsToRemove.forEach(comp => this.#removeComponentInternal(target, comp, allRemoved))
    }

    static #callListeners(event: EntityListenerEvent<EngineEntity, Components>) {
        if (this.#preventDefaultTrigger)
            return
        const listeners = EntityManager.getInstance().#listeners.get(event.type)
        Object.freeze(event)
        this.#updateByComponent(event)
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            listener.callback(event)
        }
    }

    static #updateByComponent(event: EntityListenerEvent<EngineEntity, Components>){
        const targets = event.all
        const instance = this.getInstance()
        switch (event.type) {
            case "delete": {
                instance.#byComponent.forEach(component => {
                    component.removeBlock(targets, id => id)
                })
                break
            }
            case "create": {
                for (let targetI = 0; targetI < targets.length; targetI++){
                    const entity = targets[targetI];
                    const allComponents = EntityManager.getAllComponents(entity)
                    for (let i = 0; i < allComponents.length; i++){
                        const component = allComponents[i];
                        instance.#byComponent.get(component.getComponentKey()).set(entity, entity)
                    }
                }
                break
            }
            case "component-add": {
                const targetComponents = event.targetComponents
                for (let i = 0; i < targetComponents.length; i++){
                    const component = targetComponents[i];
                    instance.#byComponent.get(component).set(event.target, event.target)
                }
                break
            }
            case "component-remove":
                const targetComponents = event.targetComponents
                for (let i = 0; i < targetComponents.length; i++){
                    const component = targetComponents[i];
                    instance.#byComponent.get(component).delete(event.target)
                }
                break
        }
    }

    static withComponent<T extends Component>(component: Components): DynamicMap<EngineEntity, EngineEntity> {
        return this.getInstance().#byComponent.get(component)
    }

    static parseEntity(entityData: { id: EngineEntity, components: [Components, Object][] }) {
        const components = new DynamicMap<Components, Component>()
        this.getEntities().set(entityData.id, components)

        for (let i1 = 0; i1 < entityData.components.length; i1++) {
            const componentObject = entityData.components[i1];
            try {
                const instance = this.#parseComponent(entityData.id, componentObject[1], componentObject[0])
                components.set(componentObject[0], instance)
            } catch (err) {
                console.error(err)
            }
        }
    }

    static #parseComponent(entity: EngineEntity, data: Object, key: Components): Component | undefined {
        const component = getComponentInstance(entity, key)
        const keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            try {
                const componentKey = keys[i]
                const value = data[componentKey]
                if (componentKey.includes("__") || componentKey.includes("#"))
                    continue
                switch (key) {
                    case Components.MESH: {
                        if (componentKey === "_meshID" || componentKey === "_materialID")
                            component[componentKey.replace("_", "")] = value
                        else
                            component[componentKey] = value
                        break
                    }
                    case Components.ATMOSPHERE:
                    case Components.DECAL: {
                        if (componentKey.charAt(0) === "_")
                            component[componentKey.substring(1, componentKey.length)] = value
                        else
                            component[componentKey] = value
                        break
                    }
                    default:
                        component[componentKey] = value
                }


            } catch (err) {
                console.error(err)
            }
        }
        return component
    }


    static getAllComponents(entity: EngineEntity) {
        return this.getEntities().get(entity).array || []
    }

    static getAllComponentsMap(entity: EngineEntity) {
        return this.getEntities().get(entity)
    }

    static getActiveEntities() {
        return this.getInstance().#activeEntities
    }

    static hasComponent(entity: EngineEntity, component: Components) {
        return this.getEntities().get(entity)?.has?.(component) ?? false
    }

    static hasAllComponents(entity: EngineEntity, ...components: Components[]) {
        const list = this.getEntities().get(entity)
        if (!list)
            return false
        let has = true
        for (let i = 0; i < components.length; i++) {
            has = has && list.has(components[i]);
        }
        return has
    }

    static delayedOperation(callback: GenericNonVoidFunction<EntityListenerEvent<EngineEntity, Components>[]>) {
        this.#preventDefaultTrigger = true
        const events = callback()
        this.#preventDefaultTrigger = false
        events.forEach(this.#callListeners)
    }

    static getEntityIds(): EngineEntity[] {
        return Array.from(this.getEntities().keys());
    }

    static clearPickingCache() {
        const i = this.getInstance()
        i.#pickInteger.clear()
        i.#pickVec3.clear()
    }

    static entityExists(found: EngineEntity): boolean {
        return this.getInstance().#entities.has(found);
    }

    static clear() {
        this.delayedOperation(() => {
            const ids = this.getEntityIds()
            this.getInstance().#childParent.clear()
            this.getInstance().#parentChildren.clear()
            this.removeEntities(ids)
            return [{type: "delete", all: ids}, {type: "hierarchy-change"}]
        })
    }

    static getParentChildren() {
        return this.getInstance().#parentChildren
    }

    static getChildParent() {
        return this.getInstance().#childParent

    }
}
