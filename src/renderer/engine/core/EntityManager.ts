import Entity from "./instances/Entity"
import AbstractSingleton from "./AbstractSingleton";
import DynamicMap from "./resource-libs/DynamicMap";
import COMPONENTS from "./static/COMPONENTS";
import {UUID} from "crypto";
import Component from "./instances/components/Component";

export default class EntityManager extends AbstractSingleton {
    #listeners = new DynamicMap<EntityEventTypes, EntityManagerListener<Entity, COMPONENTS>[]>
    #entities = new DynamicMap<UUID, Entity>()
    #lockingKey = crypto.randomUUID()

    constructor() {
        super();
        this.#entities.lock(this.#lockingKey)
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
    addEventListener(type: EntityEventTypes, callback: GenericVoidFunctionWithP<EntityListenerEvent<Entity, COMPONENTS>>, options?: EntityListenerOptions): GenericVoidFunction {
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
            const targets: EntityManagerListener<Entity, COMPONENTS>[] = this.#listeners.get(type)
            const onceCallback = (e: EntityListenerEvent<Entity, COMPONENTS>) => {
                callback(e)
                remove()
            }
            const index = targets.push({callback: options?.once ? onceCallback : callback, options}) - 1
            remove = () => targets.splice(index, 1)
            return remove
        }
    }

    updateEntity(entity: Entity, value: any, ...keys: string[]) {

        let currentObject = entity
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i]
            currentObject = currentObject?.[key]
        }
        if (currentObject) {
            currentObject[keys[keys.length - 1]] = value
        }
        this.#callListeners({target: entity, all: [entity], type: "update"})
    }

    deleteEntities(...entities: Entity[]) {
        this.#entities.unlock(this.#lockingKey)
        this.#entities.removeBlock(entities, e => e.id)
        this.#callListeners({all: entities, type: "delete"})
    }

    createEntity(id?: UUID, ...components: COMPONENTS[]): Entity {
        this.#entities.unlock(this.#lockingKey)
        const entity = new Entity(id || crypto.randomUUID())
        this.#entities.set(entity.id, entity)
        components.forEach(entity.addComponent)
        this.#callListeners({all: [entity], type: "create", targetComponents: components})
        return entity
    }

    createEntities(ids: UUID[]): Entity[] {
        this.#entities.unlock(this.#lockingKey)
        const entities = []
        for(let i =0; i < ids.length; i++){
            const entity = new Entity(ids[i])
            entities.push(entity)
        }
        this.#entities.addBlock(entities, (entity) => entity.id)
        this.#callListeners({all: entities, type: "create"})
        return entities
    }

    addComponent(target:UUID|Entity, componentType:COMPONENTS):Component {
        const entity = target instanceof Entity ? target : this.#entities.get(target)
        const component = entity.addComponent<Component>(componentType)
        this.#callListeners({target: entity, all: [entity], type: "component-add", targetComponents: [componentType]})
        return component
    }

    removeComponent(target:UUID|Entity, componentType:COMPONENTS) {
        const entity = target instanceof Entity ? target : this.#entities.get(target)
        entity.removeComponent(componentType)
        this.#callListeners({target: entity, all: [entity], type: "component-remove", targetComponents: [componentType]})
    }

    #callListeners(event: EntityListenerEvent<Entity, COMPONENTS>) {
        this.#entities.lock(this.#lockingKey)
        const listeners = this.#listeners.get(event.type)
        Object.freeze(event)
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            listener.callback(event)
        }
    }
}
