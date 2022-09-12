import EngineStore from "./EngineStore";
import {v4} from "uuid";
import SettingsStore from "./SettingsStore";
import UndoRedoAPI from "../../shared/libs/UndoRedoAPI";

export default class ActionHistoryAPI {
    static targets = {
        settings: "SETTINGS",
        entity: "ENTITY",
        block: "BLOCK"
    }
    static controller = new UndoRedoAPI()

    static pushChange({target, entityID, component, key, changeValue}) {
        ActionHistoryAPI.controller.save({
            target,
            entityID,
            component,
            key,
            changeValue: typeof changeValue === "object" ? structuredClone(changeValue) : changeValue
        })
    }

    static pushBlockChange(original) {
        ActionHistoryAPI.controller.save({
            target: ActionHistoryAPI.targets.block,
            currentSet: original
        })
    }


    static undo() {
        const hasToApply = ActionHistoryAPI.controller.undo()
        if (hasToApply)
            ActionHistoryAPI.#apply()
    }

    static redo() {
        const hasToApply = ActionHistoryAPI.controller.redo()
        if (hasToApply)
            ActionHistoryAPI.#apply()
    }

    static #apply() {
        const currentAction = ActionHistoryAPI.controller.history[ActionHistoryAPI.controller.index]
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
                        entity.components.get(currentAction.component)[currentAction.key] = currentAction.changeValue
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

