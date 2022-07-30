import DataStoreController from "./DataStoreController";
import {settingsStore} from "./settings-store";

export default class DataHistoryController {
    static targets = {
        settings: "SETTINGS",
        entity: "ENTITY"
    }
    index = -1
    history = []

    pushChange({target, entityID, component, key, changeValue}){
        if(target=== DataHistoryController.targets.entity || target=== DataHistoryController.targets.settings){
            this.history.push({
                target,
                entityID,
                component,
                key,
                changeValue: typeof changeValue === "object" ? structuredClone(changeValue) : changeValue
            })
            if(this.history.length > 10)
                this.history.shift()

            this.index = this.history.length
        }
    }

    undo(){
        if (this.index > 0 && this.history[this.index - 1]) {
            this.index -= 1
            this.#apply()
        }
    }
    redo(){
        if (this.index < 10 && this.history[this.index + 1]) {
            this.index += 1
            this.#apply()
        }
    }
    #apply(){
        const currentAction = this.history[this.index]
        if(currentAction.target === DataHistoryController.targets.entity){
            const entity = DataStoreController.engine.entities.get(currentAction.entityID)
            entity.components[currentAction.component][currentAction.key] = currentAction.changeValue
            DataStoreController.updateEngine()
        }else {
            DataStoreController.settings = currentAction.changeValue
            settingsStore.set(currentAction.changeValue)
        }
    }
}

