import EngineStore from "../../stores/EngineStore";
import UndoRedo from "./UndoRedo";
import EntityAPI from "../../../public/engine/lib/utils/EntityAPI";
import ACTION_HISTORY_TARGETS from "../../static/ACTION_HISTORY_TARGETS";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/dispatch-renderer-entities";
import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
import serializeStructure from "../../../public/engine/utils/serialize-structure";
import EntityNameController from "../controllers/EntityNameController";

export default class UndoRedoAPI {
    static engineCache = new UndoRedo()

    static clear() {
        UndoRedoAPI.engineCache.index = 0
        UndoRedoAPI.engineCache.history = [null]
    }

    static save(value, target = ACTION_HISTORY_TARGETS.ENGINE) {
        switch (target) {
            case ACTION_HISTORY_TARGETS.ENGINE:
                UndoRedoAPI.engineCache.save({
                    nameCache: new Map(EntityNameController.byName),
                    value: serializeStructure(Array.isArray(value) ? value.map(v => v.serializable()) : [value.serializable()]),
                    target,
                    time: Date.now()
                })
                break
            default:
                break
        }
    }

    static undo() {
        const action = UndoRedoAPI.engineCache.undo()
        if (action) {
            alert.pushAlert(LOCALIZATION_EN.UNDOING_CHANGES, "info")
            UndoRedoAPI.#apply(action)
        }
    }

    static redo() {
        const action = UndoRedoAPI.engineCache.redo()
        if (action) {
            alert.pushAlert(LOCALIZATION_EN.REDOING_CHANGES, "info")
            UndoRedoAPI.#apply(action)
        }
    }

    static #apply(currentAction) {
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
                dispatchRendererEntities({type: ENTITY_ACTIONS.REPLACE_BLOCK, payload: {toRemove, toAdd}})
                EngineStore.updateStore()
                break
            }
            default:
                break
        }
    }
}

