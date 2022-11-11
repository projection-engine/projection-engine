import EngineStore from "../stores/EngineStore";
import {v4} from "uuid";
import UndoRedoAPI from "./UndoRedoAPI";
import EntityAPI from "../../public/engine/api/EntityAPI";
import Engine from "../../public/engine/Engine";
import ACTION_HISTORY_TARGETS from "../data/ACTION_HISTORY_TARGETS";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import LOCALIZATION_EN from "../templates/LOCALIZATION_EN";
import serializeStructure from "../../public/engine/utils/serialize-structure";

export default class ActionHistoryAPI {
    static engineCache = new UndoRedoAPI()

    static clear() {
        ActionHistoryAPI.engineCache.index = 0
        ActionHistoryAPI.engineCache.history = [null]
    }

    static save(value, target = ACTION_HISTORY_TARGETS.ENGINE) {
        switch (target) {
            case ACTION_HISTORY_TARGETS.ENGINE:
                ActionHistoryAPI.engineCache.save({
                    value: serializeStructure(Array.isArray(value) ? value.map(v => v.serializable()) : [value.serializable()]),
                    target
                })
                break
            default:
                break
        }
    }

    static undo() {
        console.log(ActionHistoryAPI.engineCache.history )
        const action = ActionHistoryAPI.engineCache.undo()
        if (action) {
            alert.pushAlert(LOCALIZATION_EN.UNDOING_CHANGES, "info")
            ActionHistoryAPI.#apply(action)
        }
    }

    static redo() {
        const action = ActionHistoryAPI.engineCache.redo()
        if (action) {
            alert.pushAlert(LOCALIZATION_EN.REDOING_CHANGES, "info")
            ActionHistoryAPI.#apply(action)
        }
    }

    static #apply(currentAction) {
        switch (currentAction.target) {
            case ACTION_HISTORY_TARGETS.ENGINE: {
                const value = JSON.parse(currentAction.value)
                const toRemove = []
                const toAdd = []

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

