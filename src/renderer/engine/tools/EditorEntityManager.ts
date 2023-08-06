import AbstractSingleton from "../core/AbstractSingleton";
import DynamicMap from "../core/resource-libs/DynamicMap";
import EditorEntity from "./EditorEntity";
import Engine from "@engine-core/Engine";

export default class EditorEntityManager extends AbstractSingleton {
    #entities = new DynamicMap<EngineEntity, EditorEntity>()

    static get entities() {
        return this.get<EditorEntityManager>().#entities
    }

    static getInstance() {
        return this.get<EditorEntityManager>()
    }

    static serialize() {
        Engine.loadedLevel.id
    }

    static getEntity(id: EngineEntity){
        const instance = EditorEntityManager.getInstance()
        return instance.#entities.get(id)
    }
}
