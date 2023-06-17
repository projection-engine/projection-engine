import {get, writable} from "svelte/store"
import VISUAL_SETTINGS from "../../editor/static/VISUAL_SETTINGS"
import ChangesTrackerStore from "./ChangesTrackerStore"
import StoreIPCListener from "../lib/StoreIPCListener"
import UIDataStores from "../../../shared/UIDataStores";


const store = writable(VISUAL_SETTINGS)

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
			StoreIPCListener.getInstance().onUpdate(VisualsStore.data, UIDataStores.VISUALS)
		store.set(VisualsStore.data)
	}
}

