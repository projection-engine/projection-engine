import {engine} from "./engine-store";
import {get} from "svelte/store";
import {settingsStore} from "./settings-store";

export default class StoreController {
    static engine = get(engine)
    static settings = get(settingsStore)
    static getSettings(onChange) {
        return settingsStore.subscribe(newValue => {
            onChange(newValue)
        })
    }
    static getEngine(onChange) {
        return engine.subscribe(newValue => {
            onChange(newValue)
        })
    }
    static updateSettings(value=StoreController.settings) {
        // TODO - SAVE PREVIOUS VERSION
        StoreController.settings = value
        settingsStore.set({...value})
    }

    static updateEngine(value=StoreController.engine) {
        console.log(value)
        let updated = {...value}
        if (value.selected.length > 0 || value.lockedEntity)
            updated.selectedEntity = value.entities.get(value.lockedEntity ? value.lockedEntity : value.selected[0])
        else
            updated.selectedEntity = undefined


        // TODO - SAVE PREVIOUS VERSION
        StoreController.engine = updated
        engine.set(updated)
    }
}