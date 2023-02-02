import UndoRedo from "./UndoRedo";
import EntityAPI from "../../../../engine-core/lib/utils/EntityAPI";

import LOCALIZATION_EN from "../../../shared/static/LOCALIZATION_EN";
import serializeStructure from "../../../../engine-core/utils/serialize-structure";
import EntityNameController from "../controllers/EntityNameController";
import AlertController from "../../../shared/components/alert/AlertController";
import ChangesTrackerStore from "../../stores/ChangesTrackerStore";
import EntityManager from "../EntityManager";
import Entity from "../../../../engine-core/instances/Entity";

interface Action {
    nameCache: Map<string, string>
    toRemove: string[]
    toAdd: string | undefined
}

export default class EditorActionHistory {
    static #cache = new UndoRedo<Action>()

    static clear() {
        EditorActionHistory.#cache.index = 0
        EditorActionHistory.#cache.history = [null]
    }

    static save(value: Entity[] | Entity, isRemoval?: boolean) {
        ChangesTrackerStore.updateStore(true)

        const data = (Array.isArray(value) ? value.map(v => v?.serializable?.()) : [value.serializable()]).filter(e => e !== undefined)
        EditorActionHistory.#cache.save({
            nameCache: new Map(EntityNameController.byName),
            toRemove: data.map(d => d.id),
            toAdd: !isRemoval ? serializeStructure(data) : undefined
        })
    }

    static undo() {
        const action = EditorActionHistory.#cache.undo()
        if (action) {
            AlertController.log(LOCALIZATION_EN.UNDOING_CHANGES)
            EditorActionHistory.#apply(action)
        } else
            ChangesTrackerStore.updateStore(true)
    }

    static redo() {
        const action = EditorActionHistory.#cache.redo()
        if (action) {
            AlertController.log(LOCALIZATION_EN.REDOING_CHANGES)
            EditorActionHistory.#apply(action)
        }
    }

    static #apply(currentAction: Action) {
        const nameCache = currentAction.nameCache
        const toRemove = currentAction.toRemove
        const toAdd: Entity[] = []
        const parsedToAdd = currentAction.toAdd ? JSON.parse(currentAction.toAdd) : []

        EntityNameController.byName = nameCache
        for (let i = 0; i < parsedToAdd.length; i++) {
            if (!parsedToAdd[i])
                continue
            toAdd.push(EntityAPI.parseEntityObject(parsedToAdd[i]))
        }
        EntityManager.replaceBlock(toRemove, toAdd)

    }
}

