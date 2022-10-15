import {get, writable} from "svelte/store";
import SettingsStore from "./SettingsStore";
import ActionHistoryAPI from "../libs/ActionHistoryAPI";


const store = writable({});

export default class TabsStore {
    static data = get(store)

    static getStore(onChange) {
        return store.subscribe(newValue => onChange(newValue))
    }
    static updateStore(value = TabsStore.data) {
        TabsStore.data = value
        store.set(value)
    }

    static update(direction, group, value) {
        const clone = {...TabsStore.data}
        if(!clone[SettingsStore.data.currentView])
            clone[SettingsStore.data.currentView] = {}
        console.trace(group, direction, value)
        if (group !== undefined) {
            if(!clone[SettingsStore.data.currentView][direction])
                clone[SettingsStore.data.currentView][direction] = {}
            clone[SettingsStore.data.currentView][direction][group] = value
        }
        else
            clone[SettingsStore.data.currentView][direction] = value


        TabsStore.data = clone
        store.set(clone)
    }

    static getValue(direction, group, currentView = SettingsStore.data.currentView) {
        console.log(TabsStore.data)
        let value
        if (group !== undefined)
            value = TabsStore.data[currentView]?.[direction]?.[group]
        else
            value = TabsStore.data[currentView]?.[direction]

        console.log(value)

        return value === undefined ? 0 : value
    }
}

