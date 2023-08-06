import AbstractSingleton from "./AbstractSingleton";
import DynamicMap from "./resource-libs/DynamicMap";
import Component from "./components/Component";
import getComponentInstance from "./utils/get-component-instance";
import serializeStructure from "./utils/serialize-structure";
import {Components} from "./engine.enum";
import {vec3} from "gl-matrix";

export default class EntityManager extends AbstractSingleton {
    #listeners = new DynamicMap<EntityEventTypes, EntityManagerListener<EngineEntity, Components>[]>
    #entities = new DynamicMap<EngineEntity, DynamicMap<Components, Component>>()
    #childParent = new Map<EngineEntity, EngineEntity>()
    #parentChildren = new Map<EngineEntity, EngineEntity[]>()
    #activeEntities = new Map<EngineEntity, boolean>()
    #pickingIDs = new Map<EngineEntity, vec3>

    static preventDefaultTrigger = false

    constructor() {
        super();
        this.#listeners.set("component-add", [])
        this.#listeners.set("component-remove", [])
        this.#listeners.set("create", [])
        this.#listeners.set("delete", [])
        this.#listeners.set("update", [])
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

    static getEntities() {
        return this.getInstance().#entities
    }

    static getEntityKeys():EngineEntity [] {
        return Array.from(this.getInstance().#entities.keys())
    }

    static getEntityPickId(entity: EngineEntity): vec3{
        const instance = this.getInstance()
        if(!instance.#pickingIDs.get(entity) && instance.#entities.has(entity)) {
            const newValue = vec3.create()
            instance.#pickingIDs.set(entity, newValue)
            // TODO - FIND PICK ID
            // instance.#entities..indexOf(entity)
        }
        return instance.#pickingIDs.get(entity)
    }

    static getState() {
        return {
            entities: this.getEntities(),
            childParent: EntityManager.getInstance().#childParent,
            parentChildren: EntityManager.getInstance().#parentChildren
        }
    }

    static enableDisableEntity(entity: EngineEntity, state: boolean){
        this.getActiveEntities().set(entity, state)
    }

    static isEntityEnabled(entity: EngineEntity): boolean{
       return this.getActiveEntities().get(entity)
    }

    static getChildren(entity: EngineEntity): EngineEntity[] {
        return EntityManager.getInstance().#parentChildren.get(entity) || []
    }

    static getParent(entity: EngineEntity): EngineEntity | undefined {
        return EntityManager.getInstance().#childParent.get(entity)
    }

    static addParent(child: EngineEntity, parent: EngineEntity | undefined) {
        EntityManager.getInstance().#childParent.set(child, parent)
        if (parent) {
            const parentArr = EntityManager.getInstance().#parentChildren.get(parent) || []
            if (!parentArr.includes(child))
                parentArr.push(child)
            EntityManager.getInstance().#parentChildren.set(parent, parentArr)
        }
    }

    static addChildren(parent: EngineEntity, children: EngineEntity[]) {
        const parentArr = EntityManager.getInstance().#parentChildren.get(parent) || []
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            EntityManager.getInstance().#childParent.set(child, parent)
        }
        EntityManager.getInstance().#parentChildren.set(parent, Array.from(new Set([...parentArr, ...children])))
    }

    static getComponent<T>(entity: EngineEntity, component: Components): T | undefined {
        return this.getEntities().get(entity)?.get?.(component) as T
    }

    static clone(entity: EngineEntity) {
        const id = crypto.randomUUID()
        const str = serializeStructure({id, components: Array.from(this.getEntities().get(entity).entries())})
        this.#parseEntity(JSON.parse(str))
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

    static createEntities(quantity: number): EngineEntity[] {
        const entities = []
        const activeEntities = this.getActiveEntities()
        for (let i = 0; i < quantity; i++) {
            const newEntity: EngineEntity = crypto.randomUUID()
            entities.push(newEntity)
            activeEntities.set(newEntity, true)
            this.getEntities().set(newEntity, new DynamicMap<Components, Component>())
        }
        this.#callListeners({all: entities, type: "create"})
        return entities
    }

    static removeEntities(entities: EngineEntity[]) {
        const removed = {}
        const allRemoved = []
        this.#removeEntitiesInternal(entities, removed, allRemoved)
        this.#callListeners({all: allRemoved, type: "delete"})
    }

    static #removeEntitiesInternal(entities: EngineEntity[], removed: {
        [key: string]: boolean
    }, allRemoved: EngineEntity[]) {
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
        const targetMap = this.getEntities().get(target)
        const newInstance = getComponentInstance(target, componentType)
        targetMap.set(componentType, newInstance)
        this.#callListeners({target, all: [target], type: "component-add", targetComponents: [componentType]})
        return newInstance
    }

    static removeComponent(target: EngineEntity, componentType: Components) {
        const targetMap = this.getEntities().get(target)
        targetMap.delete(componentType)
        this.#callListeners({
            target: target,
            all: [target],
            type: "component-remove",
            targetComponents: [componentType]
        })
    }

    static #callListeners(event: EntityListenerEvent<EngineEntity, Components>) {
        if(this.preventDefaultTrigger)
            return
        const listeners = EntityManager.getInstance().#listeners.get(event.type)
        Object.freeze(event)
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            listener.callback(event)
        }
    }

    static restoreState(data: string) {
        try {
            const previousAll = Array.from(this.getEntities().keys())
            this.getEntities().clear()
            const json: { id: EngineEntity, components: [Components, Object][] }[] = JSON.parse(data)
            for (let i = 0; i < json.length; i++) {
                this.#parseEntity(json[i]);
            }
            this.#callListeners({all: previousAll, type: "delete"})
            this.#callListeners({all: json.map(e => e.id), type: "create"})
        } catch (err) {
            console.error(err)
        }
    }

    static #parseEntity(entityData: { id: EngineEntity, components: [Components, Object][] }) {
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
                if (componentKey.includes("__") || componentKey.includes("#") || componentKey === "_props" || componentKey === "_name")
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

    static serializeState(): string {
        const data = []
        this.getEntities().forEach((value, key) => {
            data.push({
                id: key,
                components: Array.from(value.entries())
            })
        })
        return serializeStructure(data)
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
}
