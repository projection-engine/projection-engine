import SETTINGS from "../static/SETTINGS";
import {get, writable} from "svelte/store";
import MutableObject from "../../../engine-core/MutableObject";

const settingsStore = writable(<MutableObject>SETTINGS);

export default class SettingsStore {
    static data = get(settingsStore)

    static getStore(onChange): Function {
        return settingsStore.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value: MutableObject) {
        const V = value || SettingsStore.data
        SettingsStore.data = V
        settingsStore.set(V)
    }

}

