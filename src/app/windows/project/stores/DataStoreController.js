import {engine} from "./engine-store";
import {get} from "svelte/store";
import {settingsStore} from "./settings-store";
import ENGINE from "../static/misc/ENGINE";
import {SETTINGS} from "../../../../static/WINDOWS";

export default class DataStoreController {
    static engine = ENGINE
    static settings = SETTINGS
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
    static updateSettings(value=DataStoreController.settings) {
        // TODO - SAVE PREVIOUS VERSION
        DataStoreController.settings = value
        settingsStore.set({...value})
    }

    static updateEngine(value= DataStoreController.engine) {
        let updated = {...value}
        if (value.selected.length > 0 || value.lockedEntity)
            updated.selectedEntity = value.entities.get(value.lockedEntity ? value.lockedEntity : value.selected[0])
        else
            updated.selectedEntity = undefined


        // TODO - SAVE PREVIOUS VERSION
        DataStoreController.engine = updated
        engine.set(updated)
    }
}