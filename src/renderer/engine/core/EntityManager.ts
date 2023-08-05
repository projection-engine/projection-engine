import AbstractSingleton from "./AbstractSingleton";
import DynamicMap from "./resource-libs/DynamicMap";
import Component from "./components/Component";
import getComponentInstance from "./utils/get-component-instance";
import serializeStructure from "./utils/serialize-structure";
import {Components} from "./engine.enum";

export default class EntityManager extends AbstractSingleton {
    #listeners = new DynamicMap<EntityEventTypes, EntityManagerListener<EngineEntity, Components>[]>
    #entities: DynamicMap<EngineEntity, DynamicMap<Components, Component>> = new DynamicMap()

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

    getEntities() {
        return this.#entities
    }

    /**
     * OBS: hard-change type will be triggered only for "component-add", "component-remove", "create" and "delete" event types
     * @returns removeListener method
     */
    addEventListener(type: EntityEventTypes, callback: GenericVoidFunctionWithP<EntityListenerEvent<EngineEntity, Components>>, options?: EntityListenerOptions): GenericVoidFunction {
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
            const targets: EntityManagerListener<EngineEntity, Components>[] = this.#listeners.get(type)
            const onceCallback = (e: EntityListenerEvent<EngineEntity, Components>) => {
                callback(e)
                remove()
            }
            const index = targets.push({callback: options?.once ? onceCallback : callback, options}) - 1
            remove = () => targets.splice(index, 1)
            return remove
        }
    }

    getComponent(entity: EngineEntity, component: Components): Component | undefined {
        return this.#entities.get(entity)?.get?.(component)
    }

    clone(entity: EngineEntity) {
        const id = crypto.randomUUID()
        const str = serializeStructure({id, components: Array.from(this.#entities.get(entity).entries())})
        this.#parseEntity(JSON.parse(str))
        return id
    }

    updateProperty(entity: EngineEntity, component: Components, key: string, value: any) {
        this.#entities.get(entity).get(component)[key] = value
        this.#callListeners({target: entity, all: [entity], type: "update", targetComponents: [component]})
    }

    updateProperties(entity: EngineEntity, component: Components, properties: MutableObject) {
        const entries = Object.entries(properties)
        const componentInstance = this.#entities.get(entity).get(component)
        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            componentInstance[key] = value
        }
        this.#callListeners({target: entity, all: [entity], type: "update", targetComponents: [component]})
    }

    createEntities(quantity: number): EngineEntity[] {
        const entities = []
        for (let i = 0; i < quantity; i++) {
            const newEntity: EngineEntity = crypto.randomUUID()
            entities.push(newEntity)
            this.#entities.set(newEntity, new DynamicMap<Components, Component>())
        }
        this.#callListeners({all: entities, type: "create"})
        return entities
    }

    removeEntities(entities: EngineEntity[]) {
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            this.#entities.delete(entity);
        }
        this.#callListeners({all: entities, type: "delete"})
    }

    addComponent(target: EngineEntity, componentType: Components): Component {
        const targetMap = this.#entities.get(target)
        const newInstance = getComponentInstance(target, componentType)
        targetMap.set(componentType, newInstance)
        this.#callListeners({target, all: [target], type: "component-add", targetComponents: [componentType]})
        return newInstance
    }

    removeComponent(target: EngineEntity, componentType: Components) {
        const targetMap = this.#entities.get(target)
        targetMap.delete(componentType)
        this.#callListeners({
            target: target,
            all: [target],
            type: "component-remove",
            targetComponents: [componentType]
        })
    }

    #callListeners(event: EntityListenerEvent<EngineEntity, Components>) {
        const listeners = this.#listeners.get(event.type)
        Object.freeze(event)
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            listener.callback(event)
        }
    }

    restoreState(data: string) {
        try {
            const previousAll = Array.from(this.#entities.keys())
            this.#entities.clear()
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

    #parseEntity(entityData: { id: EngineEntity, components: [Components, Object][] }) {
        const components = new DynamicMap<Components, Component>()
        this.#entities.set(entityData.id, components)
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

    #parseComponent(entity: EngineEntity, data: Object, key: Components): Component | undefined {
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

    serializeState(): string {
        const data = []
        this.#entities.forEach((value, key) => {
            data.push({
                id: key,
                components: Array.from(value.entries())
            })
        })
        return serializeStructure(data)
    }

    getAllComponents(entity: EngineEntity) {
        return this.#entities.get(entity).array
    }
}
