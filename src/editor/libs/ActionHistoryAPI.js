import EngineStore from "../stores/EngineStore";
import {v4} from "uuid";
import SettingsStore from "../stores/SettingsStore";
import UndoRedoAPI from "../../shared/libs/UndoRedoAPI";
import {EntityAPI, Engine} from "../../../public/engine/production";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";

export default class ActionHistoryAPI {
    static targets = {
        settings: "SETTINGS",
        entity: "ENTITY",
        block: "BLOCK"
    }
    static controller = new UndoRedoAPI()

    static clear() {
        ActionHistoryAPI.controller.index = 0
        ActionHistoryAPI.controller.history = [null]
    }

    static pushChange({target, entityID, component, key, changeValue}) {
        let value
        if (changeValue?.buffer != null) {
            value = []
            for (let i = 0; i < changeValue.length; i++)
                value[i] = changeValue[i]
        } else if (typeof changeValue === "object")
            value = structuredClone(changeValue)
        else value = changeValue
        ActionHistoryAPI.controller.save({
            target,
            entityID,
            component,
            key,
            changeValue: value
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
                const entity = Engine.entitiesMap.get(currentAction.entityID)
                if (currentAction.component != null) {
                    if (typeof currentAction.component === "number" && entity.scripts[currentAction.component])
                        entity.scripts[currentAction.component][currentAction.key] = currentAction.changeValue
                    else
                        entity.components.get(currentAction.component)[currentAction.key] = currentAction.changeValue
                } else {
                    if (entity[currentAction.key]?.buffer != null) {
                        for (let i = 0; i < currentAction.changeValue.length; i++)
                            entity[currentAction.key][i] = currentAction.changeValue[i]
                    } else
                        entity[currentAction.key] = currentAction.changeValue
                    entity.changed = true
                }
                EngineStore.updateStore()
                break
            }
            case targets.block:
                const newEntities = currentAction.currentSet
                const oldEntities = [...Engine.entities]
                for (let i = 0; i < newEntities.length; i++) {
                    const e = newEntities[i]
                    if (Engine.entitiesMap.get(e.id) != null)
                        continue
                    if (e.parent && !e.parent.children.includes(e))
                        e.parent.children.push(e)
                    EntityAPI.addEntity(e)
                }
                for (let i = 0; i < oldEntities.length; i++) {
                    const e = oldEntities[i]
                    if (newEntities.includes(e))
                        continue
                    EntityAPI.removeEntity(e.id)
                }
                EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
                break
            default:
                break
        }
    }
}

