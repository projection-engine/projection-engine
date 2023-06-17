import SETTINGS from "../../window-editor/static/SETTINGS"
import {get, writable} from "svelte/store"
import ChangesTrackerStore from "./ChangesTrackerStore"
import StoreManager from "./StoreManager"
import UIDataStores from "../../../contants/UIDataStores";

const settingsStore = writable(SETTINGS)

export default class SettingsStore {
	static noPush = false
	static data = get(settingsStore)
	static wasInitialized = false

	static getStore(onChange) {
		return settingsStore.subscribe(newValue => onChange(newValue))
	}

	static updateStore(value) {
		const V = value || SettingsStore.data
		const previous = SettingsStore.data

		if (SettingsStore.wasInitialized && Object.entries(V).find(o => o[1] !== previous[o[0]]) !== undefined)
			ChangesTrackerStore.updateStore(true)

		SettingsStore.wasInitialized = true
		SettingsStore.data = V
		if (!SettingsStore.noPush)
			StoreManager.onUpdate(V, UIDataStores.SETTINGS)

		settingsStore.set(V)
	}

}

