import {get, writable} from "svelte/store";
import VISUAL_SETTINGS from "../../window-editor/static/VISUAL_SETTINGS";
import ChangesTrackerStore from "./ChangesTrackerStore";
import StoreManager from "./StoreManager";
import STORES from "../../../backend/static/STORES";


const store = writable(VISUAL_SETTINGS);

export default class VisualsStore {
    static noPush = false
    static data = get(store)

    static getStore(onChange) {
        return store.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value = VisualsStore.data) {
        VisualsStore.data = {...VISUAL_SETTINGS, ...value}
        ChangesTrackerStore.updateStore(true)
        if (!VisualsStore.noPush)
            StoreManager.onUpdate(VisualsStore.data, STORES.VISUALS)
        store.set(VisualsStore.data)
    }
}

