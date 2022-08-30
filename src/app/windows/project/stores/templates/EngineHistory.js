import RendererStoreController from "../RendererStoreController";
import {settingsStore} from "./settings-store";
import Localization from "../../../../libs/Localization";
import {engine} from "./engine-store";
import {v4} from "uuid";

const MAX_DEPTH = 10
export default class EngineHistory {
    static targets = {
        settings: "SETTINGS",
        entity: "ENTITY",
        block: "BLOCK"
    }
    index = 0
    history = [null]

    pushChange({target, entityID, component, key, changeValue}) {
        if (target === EngineHistory.targets.entity || target === EngineHistory.targets.settings) {
            if (this.index < this.history.length - 1)
                this.history = this.history.slice(0, this.index + 1);


            this.history.push({
                target,
                entityID,
                component,
                key,
                changeValue: typeof changeValue === "object" ? structuredClone(changeValue) : changeValue
            })
            if (this.history.length > MAX_DEPTH)
                this.history.shift()

            this.index += 1;
        }
    }

    pushBlockChange(original) {
        if (this.index < this.history.length - 1)
            this.history = this.history.slice(0, this.index + 1);

        this.history.push({
            target: EngineHistory.targets.block,
            currentSet: original
        })
        if (this.history.length > MAX_DEPTH)
            this.history.shift()

        this.index += 1
    }

    undo() {
        console.trace(this.history, this.index)
        if (this.index > 0) {
            if (this.history[this.index].target === EngineHistory.targets.settings)
                alert.pushAlert(Localization.PROJECT.ALERTS.UNDO_SETTINGS, "info")
            else
                alert.pushAlert(Localization.PROJECT.ALERTS.UNDO_ENTITIES, "info")
            this.#apply()
            this.index -= 1
        }
    }

    redo() {
        if (this.index < this.history.length - 1) {
            this.index += 1
            if (this.history[this.index].target === EngineHistory.targets.settings)
                alert.pushAlert(Localization.PROJECT.ALERTS.REDO_SETTINGS, "info")
            else
                alert.pushAlert(Localization.PROJECT.ALERTS.REDO_ENTITIES, "info")
            this.#apply()
        }
    }

    #apply() {
        const currentAction = this.history[this.index]
        if (!currentAction)
            return
        const targets = EngineHistory.targets
        switch (currentAction.target) {
            case targets.settings: {
                RendererStoreController.settings = currentAction.changeValue
                settingsStore.set(currentAction.changeValue)
                break
            }
            case targets.entity: {
                const entity = RendererStoreController.engine.entities.get(currentAction.entityID)
                if (currentAction.component != null) {
                    if (typeof currentAction.component === "number" && entity.scripts[currentAction.component])
                        entity.scripts[currentAction.component][currentAction.key] = currentAction.changeValue
                    else
                        entity.components[currentAction.component][currentAction.key] = currentAction.changeValue
                } else {
                    entity[currentAction.key] = currentAction.changeValue
                    entity.changed = true
                }
                RendererStoreController.updateEngine()
                break
            }
            case targets.block:
                const {currentSet} = currentAction
                const entities = RendererStoreController.engine.entities
                entities.clear()
                for (let i = 0; i < currentSet.length; i++) {
                    const current = currentSet[i]
                    entities.set(current.id, current)
                }
                RendererStoreController.updateEngine({...RendererStoreController.engine, entities, changeID: v4()})
                break
            default:
                break
        }
    }
}

