import EngineStore from "./EngineStore";

import Localization from "../../../libs/Localization";
import {v4} from "uuid";
import SettingsStore from "./SettingsStore";

const MAX_DEPTH = 10
export default class ActionHistoryAPI {
    static targets = {
        settings: "SETTINGS",
        entity: "ENTITY",
        block: "BLOCK"
    }
    static index = 0
    static history = [null]

    static pushChange({target, entityID, component, key, changeValue}) {
        if (target === ActionHistoryAPI.targets.entity || target === ActionHistoryAPI.targets.settings) {
            if (ActionHistoryAPI.index < ActionHistoryAPI.history.length - 1)
                ActionHistoryAPI.history = ActionHistoryAPI.history.slice(0, ActionHistoryAPI.index + 1);


            ActionHistoryAPI.history.push({
                target,
                entityID,
                component,
                key,
                changeValue: typeof changeValue === "object" ? structuredClone(changeValue) : changeValue
            })
            if (ActionHistoryAPI.history.length > MAX_DEPTH)
                ActionHistoryAPI.history.shift()

            ActionHistoryAPI.index += 1;
        }
    }

    static pushBlockChange(original) {
        if (ActionHistoryAPI.index < ActionHistoryAPI.history.length - 1)
            ActionHistoryAPI.history = ActionHistoryAPI.history.slice(0, ActionHistoryAPI.index + 1);

        ActionHistoryAPI.history.push({
            target: ActionHistoryAPI.targets.block,
            currentSet: original
        })
        if (ActionHistoryAPI.history.length > MAX_DEPTH)
            ActionHistoryAPI.history.shift()

        ActionHistoryAPI.index += 1
    }

    static undo() {
        console.trace(ActionHistoryAPI.history, ActionHistoryAPI.index)
        if (ActionHistoryAPI.index > 0) {
            if (ActionHistoryAPI.history[ActionHistoryAPI.index].target === ActionHistoryAPI.targets.settings)
                alert.pushAlert(Localization.PROJECT.ALERTS.UNDO_SETTINGS, "info")
            else
                alert.pushAlert(Localization.PROJECT.ALERTS.UNDO_ENTITIES, "info")
            ActionHistoryAPI.#apply()
            ActionHistoryAPI.index -= 1
        }
    }


    static redo() {
        if (ActionHistoryAPI.index < ActionHistoryAPI.history.length - 1) {
            ActionHistoryAPI.index += 1
            if (ActionHistoryAPI.history[ActionHistoryAPI.index].target === ActionHistoryAPI.targets.settings)
                alert.pushAlert(Localization.PROJECT.ALERTS.REDO_SETTINGS, "info")
            else
                alert.pushAlert(Localization.PROJECT.ALERTS.REDO_ENTITIES, "info")
            ActionHistoryAPI.#apply()
        }
    }

    static #apply() {
        const currentAction = ActionHistoryAPI.history[ActionHistoryAPI.index]
        if (!currentAction)
            return
        const targets = ActionHistoryAPI.targets
        switch (currentAction.target) {
            case targets.settings: {
                SettingsStore.data = currentAction.changeValue
                SettingsStore.updateStore(currentAction.changeValue, true)
                break
            }
            case targets.entity: {
                const entity = EngineStore.engine.entities.get(currentAction.entityID)
                if (currentAction.component != null) {
                    if (typeof currentAction.component === "number" && entity.scripts[currentAction.component])
                        entity.scripts[currentAction.component][currentAction.key] = currentAction.changeValue
                    else
                        entity.components[currentAction.component][currentAction.key] = currentAction.changeValue
                } else {
                    entity[currentAction.key] = currentAction.changeValue
                    entity.changed = true
                }
                EngineStore.updateStore()
                break
            }
            case targets.block:
                const {currentSet} = currentAction
                const entities = EngineStore.engine.entities
                entities.clear()
                for (let i = 0; i < currentSet.length; i++) {
                    const current = currentSet[i]
                    entities.set(current.id, current)
                }
                EngineStore.updateStore({...EngineStore.engine, entities, changeID: v4()})
                break
            default:
                break
        }
    }
}

