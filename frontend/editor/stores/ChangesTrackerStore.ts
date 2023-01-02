import {get, writable} from "svelte/store";
import SettingsStore from "./SettingsStore";
import MutableObject from "../../../engine-core/MutableObject";


const store = writable(false);

export default class ChangesTrackerStore {
    static data:boolean = get(store)

    static getStore(onChange) {
        return store.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value?:boolean) {
        if(value === ChangesTrackerStore.data)
            return
        ChangesTrackerStore.data = value
        store.set(value)
    }
}

