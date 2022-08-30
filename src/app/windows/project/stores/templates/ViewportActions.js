import RendererStoreController from "../RendererStoreController";
import {settingsStore} from "./settings-store";
import Localization from "../../../../libs/Localization";

export default class ViewportActions {
    static targets = {
        settings: "SETTINGS",
        entity: "ENTITY"
    }
    index = -1
    history = []

    pushChange({target, entityID, component, key, changeValue}) {
        if (target === ViewportActions.targets.entity || target === ViewportActions.targets.settings) {
            this.history.push({
                target,
                entityID,
                component,
                key,
                changeValue: typeof changeValue === "object" ? structuredClone(changeValue) : changeValue
            })
            if (this.history.length > 10)
                this.history.shift()

            this.index = this.history.length - 1
        }
    }

    undo() {
        if (this.index > 0 && this.history[this.index - 1]) {
            this.index -= 1
            if (this.history[this.index].target === ViewportActions.targets.settings)
                alert.pushAlert(Localization.PROJECT.ALERTS.UNDO_SETTINGS, "info")
            else
                alert.pushAlert(Localization.PROJECT.ALERTS.UNDO_ENTITIES, "info")
            this.#apply()

        }
    }

    redo() {
        if (this.index < 10 && this.history[this.index + 1]) {
            this.index += 1
            if (this.history[this.index].target === ViewportActions.targets.settings)
                alert.pushAlert(Localization.PROJECT.ALERTS.REDO_SETTINGS, "info")
            else
                alert.pushAlert(Localization.PROJECT.ALERTS.REDO_ENTITIES, "info")
            this.#apply()
        }
    }

    #apply() {
        const currentAction = this.history[this.index]
        if (currentAction.target === ViewportActions.targets.entity) {
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
        } else {
            RendererStoreController.settings = currentAction.changeValue
            settingsStore.set(currentAction.changeValue)
        }
    }
}

