import SETTINGS from "../static/SETTINGS";
import {get, writable} from "svelte/store";

const settingsStore = writable(SETTINGS);

export default class SettingsStore {
    static data = get(settingsStore)

    static getStore(onChange):Function {
        return settingsStore.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value = SettingsStore.data) {
        SettingsStore.data = value
        settingsStore.set(value)
    }

}

