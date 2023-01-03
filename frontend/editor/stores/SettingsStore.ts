import SETTINGS from "../../static/SETTINGS";
import {get, writable} from "svelte/store";
import MutableObject from "../../../engine-core/MutableObject";
import ChangesTrackerStore from "./ChangesTrackerStore";

const settingsStore = writable(SETTINGS);

export default class SettingsStore {
    static data = get(settingsStore)
    static wasInitialized = false

    static getStore(onChange): Function {
        return settingsStore.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value) {
        const V = value || SettingsStore.data
        const previous = SettingsStore.data

        if (SettingsStore.wasInitialized&& Object.entries(V).find(o => o[1] !== previous[o[0]]) !== undefined)
            ChangesTrackerStore.updateStore(true)

        SettingsStore.wasInitialized =true
        SettingsStore.data = V
        settingsStore.set(V)
    }

}

