import AbstractSingleton from "../AbstractSingleton";
import DynamicMap from "../lib/DynamicMap";
import AbstractComponent from "@engine-core/lib/components/AbstractComponent";
import getComponentInstance from "../utils/get-component-instance";
import serializeStructure from "../utils/serialize-structure";
import {Components} from "../engine.enum";
import {vec3} from "gl-matrix";
import LightsManager from "@engine-core/managers/LightsManager";
import PickingUtil from "@engine-core/utils/PickingUtil";
import LevelManager from "@engine-core/managers/LevelManager";

export default class EntityManager extends AbstractSingleton {
    #listeners = new DynamicMap<EntityEventTypes, EntityManagerListener<EngineEntity, Components>[]>
    #entities = new DynamicMap<EngineEntity, DynamicMap<Components, AbstractComponent>>()
    #childParent = new Map<EngineEntity, EngineEntity>()
    #parentChildren = new Map<EngineEntity, EngineEntity[]>()
    #activeEntities = new Map<EngineEntity, boolean>()
    #pickInteger = new Map<number, EngineEntity>
    #pickVec3 = new Map<EngineEntity, vec3>
    #byComponent = new Map<Components, DynamicMap<EngineEntity, EngineEntity>>()
    static #preventDefaultTrigger = false
    static #FALLBACK_PID = vec3.create();

    constructor() {
        super();
        this.#listeners.set("component-add", [])
        this.#listeners.set("component-remove", [])
        this.#listeners.set("create", [])
        this.#listeners.set("delete", [])
        this.#listeners.set("update", [])
        this.#listeners.set("hierarchy-change", [])
        const comps = Object.values(Components)
        for (let i = 0; i < comps.length; i++) {
            const c = comps[i];
            this.#byComponent.set(c as Components, new DynamicMap<EngineEntity, EngineEntity>());
        }
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
                EntityManager.addEventListener("component-add", callback, options),
                EntityManager.addEventListener("component-remove", callback, options),
                EntityManager.addEventListener("create", callback, options),
                EntityManager.addEventListener("delete", callback, options)
            ]
            return () => toRemove.forEach(f => f())
        } else {
            let remove: VoidFunction
            const targets = EntityManager.getInstance().#listeners.get(type)
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
        return EntityManager.getInstance().#entities
    }

    static getEntityKeys(): EngineEntity [] {
        return Array.from(EntityManager.getInstance().#entities.keys())
    }

    static getEntityPickVec3(entity: EngineEntity): vec3 {
        const instance = EntityManager.getInstance()
        let pId = instance.#pickVec3.get(entity)
        if (pId == null && EntityManager.entityExists(entity) && (EntityManager.hasAllComponents(entity, Components.TRANSFORMATION, Components.MESH) || EntityManager.hasAllComponents(entity, Components.TRANSFORMATION, Components.SPRITE))) {
            const index = instance.#pickInteger.size + 4
            pId = PickingUtil.getPickerId(index) as vec3
            instance.#pickVec3.set(entity, pId)
            instance.#pickInteger.set(index, entity)
        }
        return pId ?? EntityManager.#FALLBACK_PID
    }

    static getEntityWithPickIndex(index: number): EngineEntity | undefined {
        return EntityManager.getInstance().#pickInteger.get(index)
    }

    static getState() {
        return {
            entities: EntityManager.getEntities(),
            childParent: EntityManager.getInstance().#childParent,
            parentChildren: EntityManager.getInstance().#parentChildren
        }
    }

    static toggleEntityActiveState(entity: EngineEntity) {
        const original = EntityManager.getActiveEntities().get(entity)
        EntityManager.#enableDisableEntityInternal([entity], !original)
        if (EntityManager.hasComponent(entity, Components.LIGHT) || EntityManager.hasComponent(entity, Components.ATMOSPHERE)) {
            LightsManager.packageLights(false, true)
        }
    }

    static #enableDisableEntityInternal(entities: EngineEntity[], state: boolean) {
        const collected: EngineEntity[] = []
        const activeEntities = EntityManager.getActiveEntities()
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            collected.push(...EntityManager.getChildren(entity))
            activeEntities.set(entity, state)
        }
        EntityManager.clearPickingCache()
        if (collected.length > 0) {
            EntityManager.#enableDisableEntityInternal(collected, state)
        }
    }

    static isEntityEnabled(entity: EngineEntity): boolean {
        return EntityManager.getActiveEntities().get(entity)
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
        const prevParent = EntityManager.getParent(child)
        const ins = EntityManager.getInstance()
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
        EntityManager.#callListeners({type: "hierarchy-change"})
    }

    static addChildren(parent: EngineEntity, children: EngineEntity[]) {
        const ins = EntityManager.getInstance()
        const parentArr = ins.#parentChildren.get(parent) || []
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const prevParent = EntityManager.getParent(child)
            ins.#childParent.set(child, parent)
            if (prevParent) {
                const parentArr = ins.#parentChildren.get(prevParent) || []
                EntityManager.getInstance().#parentChildren.set(prevParent, parentArr.filter(e => e === child))
            }
        }
        EntityManager.clearPickingCache()
        ins.#parentChildren.set(parent, Array.from(new Set([...parentArr, ...children])))
    }

    static getComponent<T>(entity: EngineEntity, component: Components): T | undefined {
        if (!entity)
            return
        return EntityManager.getEntities().get(entity)?.get?.(component) as T
    }

    static clone(entity: EngineEntity, targetId?: EngineEntity) {
        const id = targetId ?? crypto.randomUUID()
        const str = serializeStructure({id, components: Array.from(EntityManager.getEntities().get(entity).entries())})
        EntityManager.parseEntity(JSON.parse(str))
        EntityManager.clearPickingCache()
        return id
    }

    static updateProperty(entity: EngineEntity, component: Components, key: string, value: any) {
        EntityManager.getEntities().get(entity).get(component)[key] = value
        EntityManager.#callListeners({target: entity, all: [entity], type: "update", targetComponents: [component]})
    }

    static updateProperties(entity: EngineEntity, component: Components, properties: MutableObject) {
        const entries = Object.entries(properties)
        const componentInstance = EntityManager.getEntities().get(entity).get(component)
        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            componentInstance[key] = value
        }
        EntityManager.#callListeners({target: entity, all: [entity], type: "update", targetComponents: [component]})
    }

    static createEntitiesById(entities: EngineEntity[]): EngineEntity[] {
        if (!LevelManager.loadedLevel) {
            return
        }
        const activeEntities = EntityManager.getActiveEntities()
        for (let i = 0; i < entities.length; i++) {
            const newEntity = entities[i]
            activeEntities.set(newEntity, true)
            EntityManager.getEntities().set(newEntity, new DynamicMap<Components, AbstractComponent>())
        }
        EntityManager.clearPickingCache()
        EntityManager.#callListeners({all: entities, type: "create"})
        return entities
    }

    static removeEntities(entities: EngineEntity[]) {
        if (!LevelManager.loadedLevel) {
            return
        }
        const removed = {}
        const allRemoved = []
        EntityManager.#removeEntitiesInternal(entities, removed, allRemoved)
        EntityManager.clearPickingCache()
        EntityManager.#callListeners({all: allRemoved, type: "delete"})
    }

    static #removeEntitiesInternal(entities: EngineEntity[], removed: TypedObject<boolean>, allRemoved: EngineEntity[]) {
        const collected: EngineEntity[] = []
        const activeEntities = EntityManager.getActiveEntities()
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            EntityManager.getEntities().delete(entity);
            activeEntities.delete(entity)
            if (!removed[entity]) {
                const parentEntity = EntityManager.getInstance().#childParent.get(entity)
                const parentDeps = EntityManager.getInstance().#parentChildren.get(parentEntity)
                if (parentDeps) {
                    removed[entity] = true
                    EntityManager.getInstance().#parentChildren.set(parentEntity, parentDeps.filter(e => e !== entity))
                }
            }
            collected.push(...EntityManager.getChildren(entity))
            allRemoved.push(entity)
        }
        if (collected.length > 0) {
            EntityManager.#removeEntitiesInternal(collected, removed, allRemoved)
        }
    }

    static addComponent(target: EngineEntity, componentType: Components): AbstractComponent {
        const allAdded: AbstractComponent[] = []
        EntityManager.#addComponentInternal(target, componentType, allAdded)
        EntityManager.#callListeners({
            target,
            all: [target],
            type: "component-add",
            targetComponents: allAdded.map(e => e.getComponentKey())
        })
        return allAdded[0]
    }

    static #addComponentInternal(target: EngineEntity, componentType: Components, allAdded: AbstractComponent[]) {
        const targetMap = EntityManager.getEntities().get(target)
        if (!targetMap) {
            console.warn("NO MAP FOUND FOR ENTITY: " + target)
            return
        }
        if (!targetMap.has(componentType)) {
            const newInstance = getComponentInstance(target, componentType)
            if(newInstance == null) {
                console.warn("COMPONENT NOT FOUND: " + componentType)
                return;
            }
            targetMap.set(componentType, newInstance)
            allAdded.push(newInstance)
        }
        targetMap.get(componentType).getDependencies().forEach(c => {
            EntityManager.#addComponentInternal(target, c, allAdded)
        })
    }

    static removeComponent(target: EngineEntity, componentType: Components) {
        const allRemoved: Components[] = []
        EntityManager.#removeComponentInternal(target, componentType, allRemoved)
        EntityManager.#callListeners({
            target: target,
            all: [target],
            type: "component-remove",
            targetComponents: allRemoved
        })
    }

    static #removeComponentInternal(target: EngineEntity, componentType: Components, allRemoved: Components[]) {
        const targetMap = EntityManager.getEntities().get(target)
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
        componentsToRemove.forEach(comp => EntityManager.#removeComponentInternal(target, comp, allRemoved))
    }

    static #callListeners(event: EntityListenerEvent<EngineEntity, Components>) {
        if (EntityManager.#preventDefaultTrigger)
            return
        const listeners = EntityManager.getInstance().#listeners.get(event.type)
        Object.freeze(event)
        EntityManager.#updateByComponent(event)
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            listener.callback(event)
        }
    }

    static #updateByComponent(event: EntityListenerEvent<EngineEntity, Components>) {
        const targets = event.all
        const instance = EntityManager.getInstance()
        switch (event.type) {
            case "delete": {
                instance.#byComponent.forEach(component => {
                    component.removeBlock(targets, id => id)
                })
                break
            }
            case "create": {
                for (let targetI = 0; targetI < targets.length; targetI++) {
                    const entity = targets[targetI];
                    const allComponents = EntityManager.getAllComponents(entity)
                    for (let i = 0; i < allComponents.length; i++) {
                        const component = allComponents[i];
                        instance.#byComponent.get(component.getComponentKey()).set(entity, entity)
                    }
                }
                break
            }
            case "component-add": {
                const targetComponents = event.targetComponents
                for (let i = 0; i < targetComponents.length; i++) {
                    const component = targetComponents[i];
                    instance.#byComponent.get(component).set(event.target, event.target)
                }
                break
            }
            case "component-remove":
                const targetComponents = event.targetComponents
                for (let i = 0; i < targetComponents.length; i++) {
                    const component = targetComponents[i];
                    instance.#byComponent.get(component).delete(event.target)
                }
                break
        }
    }

    static withComponent<T extends AbstractComponent>(component: Components): DynamicMap<EngineEntity, EngineEntity> {
        return EntityManager.getInstance().#byComponent.get(component)
    }

    static parseEntity(entityData: { id: EngineEntity, components: [Components, Object][] }) {
        if (!entityData)
            return
        const components = new DynamicMap<Components, AbstractComponent>()
        EntityManager.getEntities().set(entityData.id, components)

        for (let i1 = 0; i1 < entityData.components.length; i1++) {
            const componentObject = entityData.components[i1];
            try {
                const instance = EntityManager.#parseComponent(entityData.id, componentObject[1], componentObject[0])
                components.set(componentObject[0], instance)
            } catch (err) {
                console.error(err)
            }
        }
    }

    static #parseComponent(entity: EngineEntity, data: Object, key: Components): AbstractComponent | undefined {
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
        return EntityManager.getEntities().get(entity)?.array || []
    }

    static getAllComponentsMap(entity: EngineEntity) {
        return EntityManager.getEntities().get(entity)
    }

    static getActiveEntities() {
        return EntityManager.getInstance().#activeEntities
    }

    static hasComponent(entity: EngineEntity, component: Components) {
        return EntityManager.getEntities().get(entity)?.has?.(component) ?? false
    }

    static hasAllComponents(entity: EngineEntity, ...components: Components[]) {
        const list = EntityManager.getEntities().get(entity)
        if (!list)
            return false
        let has = true
        for (let i = 0; i < components.length; i++) {
            has = has && list.has(components[i]);
        }
        return has
    }

    static delayedOperation(callback: GenericNonVoidFunction<EntityListenerEvent<EngineEntity, Components>[]>) {
        EntityManager.#preventDefaultTrigger = true
        const events = callback()
        EntityManager.#preventDefaultTrigger = false
        events.forEach(EntityManager.#callListeners)
    }

    static getEntityIds(): EngineEntity[] {
        return Array.from(EntityManager.getEntities().keys());
    }

    static clearPickingCache() {
        const i = EntityManager.getInstance()
        i.#pickInteger.clear()
        i.#pickVec3.clear()
    }

    static entityExists(found: EngineEntity): boolean {
        return EntityManager.getInstance().#entities.has(found);
    }

    static clear() {
        EntityManager.delayedOperation(() => {
            const ids = EntityManager.getEntityIds()
            EntityManager.getInstance().#childParent.clear()
            EntityManager.getInstance().#parentChildren.clear()
            EntityManager.removeEntities(ids)
            return [{type: "delete", all: ids}, {type: "hierarchy-change"}]
        })
    }

    static getParentChildren() {
        return EntityManager.getInstance().#parentChildren
    }

    static getChildParent() {
        return EntityManager.getInstance().#childParent

    }
}
