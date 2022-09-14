import EngineStore from "../stores/EngineStore";
import {v4} from "uuid";
import SettingsStore from "../stores/SettingsStore";
import UndoRedoAPI from "../../shared/libs/UndoRedoAPI";

export default class ActionHistoryAPI {
    static targets = {
        settings: "SETTINGS",
        entity: "ENTITY",
        block: "BLOCK"
    }
    static controller = new UndoRedoAPI()

    static #cloneObject(obj) {
        if (Array.isArray(obj)) {
            const temp = []
            for (let i = 0; i < obj.length; i++)
                temp[i] = obj[i]
            return temp
        }
        return obj
    }

    static pushChange({target, entityID, component, key, changeValue}) {
        let value
        if(changeValue?.buffer != null){
            value = []
            for(let i =0; i < changeValue.length; i++)
                value[i] = changeValue[i]
        }
        else if(typeof changeValue === "object")
            value = structuredClone(changeValue)
        else value = changeValue
        console.log(value, changeValue)
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
                const entity = EngineStore.engine.entities.get(currentAction.entityID)
                if (currentAction.component != null) {
                    if (typeof currentAction.component === "number" && entity.scripts[currentAction.component])
                        entity.scripts[currentAction.component][currentAction.key] = currentAction.changeValue
                    else
                        entity.components.get(currentAction.component)[currentAction.key] = currentAction.changeValue
                } else {
                    console.log(entity[currentAction.key], currentAction.changeValue)
                    if (entity[currentAction.key]?.buffer != null) {
                        for (let i = 0; i < currentAction.changeValue.length; i++)
                            entity[currentAction.key][i] = currentAction.changeValue[i]
                    }
                    else
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

