import UndoRedo from "./UndoRedo";
import EntityAPI from "../../../../../engine-core/lib/utils/EntityAPI";
import ACTION_HISTORY_TARGETS from "../../static/ACTION_HISTORY_TARGETS";

import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
import serializeStructure from "../../../../../engine-core/utils/serialize-structure";
import EntityNameController from "../controllers/EntityNameController";
import AlertController from "../../../../components/alert/AlertController";
import ChangesTrackerStore from "../../stores/ChangesTrackerStore";
import EntityManager from "../EntityManager";

export default class UndoRedoAPI {
    static #cache = new UndoRedo()
    static onChange


    static clear() {
        UndoRedoAPI.#cache.index = 0
        UndoRedoAPI.#cache.history = [null]

        UndoRedoAPI.onChange?.([], 0)
    }

    static save(value, target = ACTION_HISTORY_TARGETS.ENGINE) {
        ChangesTrackerStore.updateStore(true)
        switch (target) {
            case ACTION_HISTORY_TARGETS.ENGINE: {
                const data = Array.isArray(value) ? value.map(v => v.serializable()) : [value.serializable()]
                UndoRedoAPI.#cache.save({
                    nameCache: new Map(EntityNameController.byName),
                    value: serializeStructure(data),
                    changed: data.length,
                    target,
                    time: (new Date()).toLocaleTimeString()
                })
                break
            }
            case ACTION_HISTORY_TARGETS.SHADER_EDITOR:
                UndoRedoAPI.#cache.save({
                    value,
                    changed: value.changed || 1,
                    target,
                    time: (new Date()).toLocaleTimeString()
                })

                break
            default:
                break
        }

        UndoRedoAPI.onChange?.(UndoRedoAPI.#cache.history.slice(1, UndoRedoAPI.#cache.history.length).map((e, i) => ({
            ...e,
            index: i
        })), UndoRedoAPI.#cache.index)
    }

    static clearShaderEditorStates() {
        UndoRedoAPI.#cache.history = UndoRedoAPI.#cache.history.filter(h => !h || h.target !== ACTION_HISTORY_TARGETS.SHADER_EDITOR)
        UndoRedoAPI.#cache.index = Math.max(UndoRedoAPI.#cache.history.length - 1, 0)
        UndoRedoAPI.onChange?.(UndoRedoAPI.#cache.history, UndoRedoAPI.#cache.index)
    }

    static applyIndex(i) {
        if (i <= 0 || i > UndoRedoAPI.#cache.history.length - 1)
            return

        const actualIndex = () => UndoRedoAPI.#cache.index
        let lastChange

        if (i < actualIndex())
            while (i !== actualIndex())
                lastChange = UndoRedoAPI.#cache.undo()
        else if (i > actualIndex())
            while (i !== actualIndex())
                lastChange = UndoRedoAPI.#cache.redo()
        if (lastChange)
            UndoRedoAPI.#apply(lastChange)
    }

    static undo() {
        const action = UndoRedoAPI.#cache.undo()
        if (action) {
            AlertController.log(LOCALIZATION_EN.UNDOING_CHANGES)
            UndoRedoAPI.#apply(action)
        }else
            ChangesTrackerStore.updateStore(true)
    }

    static redo() {
        const action = UndoRedoAPI.#cache.redo()
        if (action) {
            AlertController.log(LOCALIZATION_EN.REDOING_CHANGES)
            UndoRedoAPI.#apply(action)
        }

    }

    static #apply(currentAction) {
        UndoRedoAPI.onChange?.(UndoRedoAPI.#cache.history.slice(1, UndoRedoAPI.#cache.history.length).map((e, i) => ({
            ...e,
            index: i
        })), UndoRedoAPI.#cache.index)
        switch (currentAction.target) {
            case ACTION_HISTORY_TARGETS.ENGINE: {
                const value = JSON.parse(currentAction.value)
                const nameCache = currentAction.nameCache
                const toRemove = []
                const toAdd = []
                EntityNameController.byName = nameCache
                for (let i = 0; i < value.length; i++) {
                    toAdd.push(EntityAPI.parseEntityObject(value[i]))
                    toRemove.push(value[i].id)
                }
                EntityManager.replaceBlock(toRemove, toAdd)
                break
            }
            case ACTION_HISTORY_TARGETS.SHADER_EDITOR:
                currentAction.value?.callback?.()
                break
            default:
                break
        }
    }
}

