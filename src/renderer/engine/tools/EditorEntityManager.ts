import AbstractSingleton from "../core/AbstractSingleton";
import DynamicMap from "../core/resource-libs/DynamicMap";
import EditorEntity from "./EditorEntity";
import * as crypto from "crypto";
import EntityManager from "@engine-core/EntityManager";
import serializeStructure from "@engine-core/utils/serialize-structure";

export default class EditorEntityManager extends AbstractSingleton {
    #entities = new DynamicMap<EngineEntity, EditorEntity>()

    static get entities() {
        return this.get<EditorEntityManager>().#entities
    }

    static getInstance() {
        return this.get<EditorEntityManager>()
    }

    static getEntity(id: EngineEntity) {
        return EditorEntityManager.getInstance().#entities.get(id)
    }

    static create(id?: crypto.UUID): EditorEntity {
        const entity = new EditorEntity(id)
        EntityManager.createEntitiesById([entity.id])
        return entity
    }

    static getEntities() {
        return this.getInstance().#entities
    }

    static serializeState(): string {
        return serializeStructure(this.getInstance().#entities.array)
    }
}
