import {get, writable} from "svelte/store";
import VISUAL_SETTINGS from "../static/VISUAL_SETTINGS";
import ChangesTrackerStore from "./ChangesTrackerStore";


const store = writable(VISUAL_SETTINGS);

export default class VisualsStore {
    static data = get(store)

    static getStore(onChange) {
        return store.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value = VisualsStore.data) {
        VisualsStore.data = {...VISUAL_SETTINGS, ...value}
        ChangesTrackerStore.updateStore(true)
        store.set(VisualsStore.data)

    }
}

