import AbstractSingleton from "../core/AbstractSingleton";
import DynamicMap from "@engine-core/lib/DynamicMap";
import EditorEntity from "./EditorEntity";
import EntityManager from "@engine-core/managers/EntityManager";
import serializeStructure from "@engine-core/utils/serialize-structure";
import {UUID} from "crypto";

export default class EditorEntityManager extends AbstractSingleton {
    #entities = new DynamicMap<EngineEntity, EditorEntity>()

    static* #getIncrementalCloneIndex() {
        let index = 0
        while (true) {
            yield index;
            index++;
        }
    }

    static get entities() {
        return this.get<EditorEntityManager>().#entities
    }

    static getInstance() {
        return this.get<EditorEntityManager>()
    }

    static getEntity(id: EngineEntity) {
        return EditorEntityManager.getInstance().#entities.get(id)
    }

    static create(id?: UUID): EditorEntity {
        const entity = new EditorEntity(id)
        console.trace("HERE")
        EntityManager.createEntitiesById([entity.id])
        return entity
    }

    static getEntities() {
        return this.getInstance().#entities
    }

    static serializeState(): string {
        return serializeStructure(this.getInstance().#entities.array)
    }

    static restoreState(editorState: string) {
        if (!editorState)
            return

        try {
            const entitiesToLoad = JSON.parse(editorState)
            const entities = this.getInstance().#entities
            entities.clear()
            for (let i = 0; i < entitiesToLoad.length; i++) {
                const entityObj = entitiesToLoad[i];
                const instance = new EditorEntity(entityObj.id)
                instance.name = entityObj.name
                entities.set(instance.id, instance)
            }
        } catch (err) {
            console.error(err)
        }
    }

    static clone(toClone: EditorEntity) {
        const newInstance = new EditorEntity()
        newInstance.name = toClone.name + this.#getIncrementalCloneIndex().next().value

        this.getInstance().#entities.set(newInstance.id, newInstance)
        EntityManager.clone(toClone.id, newInstance.id)
        return newInstance
    }
}
