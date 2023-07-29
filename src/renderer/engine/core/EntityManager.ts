import Entity from "./instances/Entity"
import AbstractSingleton from "./AbstractSingleton";
import DynamicMap from "./resource-libs/DynamicMap";

export default class EntityManager extends AbstractSingleton {
    static #listeners = new Map<string, DynamicMap<string, Function>>()

    addListener(entityID: string, id: string, callback: Function) {
        const prev = EntityManager.#listeners.get(entityID) ?? []
        if (!EntityManager.#listeners.has(entityID))
            EntityManager.#listeners.set(entityID, new DynamicMap<string, Function>())
        const current = EntityManager.#listeners.get(entityID)
        current.set(id, callback)
    }

    removeListener(entityID: string, id: string) {
        if (!entityID)
            return
        const prev = EntityManager.#listeners.get(entityID)
        if (!prev)
            return;
        prev.delete(id)
    }

    updateEntity(entity: Entity, value: any, ...keys: string[]) {
        let currentObject = entity
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i]
            currentObject = currentObject?.[key]
        }
        if (currentObject) {
            currentObject[keys[keys.length - 1]] = value
            const listeners = EntityManager.#listeners.get(entity.id) ?? []
            listeners.forEach(l => {
                l.callback?.(entity, value, keys)
            })
        }
    }

    deleteEntity(entityID: string) {
        EntityManager.#listeners.delete(entityID)
        // TODO
    }

    createEntity() {
        // TODO
    }

    addComponent() {
        // TODO
    }

    removeComponent() {
        // TODO
    }
}
