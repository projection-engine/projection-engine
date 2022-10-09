import {get, writable} from "svelte/store";
import VISUAL_SETTINGS from "../data/VISUAL_SETTINGS";


const store = writable(VISUAL_SETTINGS);

export default class VisualsStore {
    static data = get(store)

    static getStore(onChange) {
        return store.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value = store.data) {
        store.data = value
        store.set(value)
    }
}

