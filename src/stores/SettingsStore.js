import ActionHistoryAPI from "../libs/ActionHistoryAPI";
import SETTINGS from "../data/SETTINGS";
import {get, writable} from "svelte/store";

let initialized = false

const settingsStore = writable(SETTINGS);

export default class SettingsStore {
    static data = get(settingsStore)

    static getStore(onChange) {
        return settingsStore.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value = SettingsStore.data, noSaving) {

        if (!noSaving && initialized) {
            ActionHistoryAPI.pushChange({
                target: ActionHistoryAPI.targets.settings,
                changeValue: SettingsStore.data
            })
            ActionHistoryAPI.pushChange({
                target: ActionHistoryAPI.targets.settings,
                changeValue: value
            })
        }
        initialized = true
        SettingsStore.data = value
        settingsStore.set(value)
    }

}

