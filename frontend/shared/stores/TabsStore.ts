import {get, writable} from "svelte/store"
import SettingsStore from "./SettingsStore"
import ChangesTrackerStore from "./ChangesTrackerStore"
import AbstractStore from "./AbstractStore"


const store = writable(<MutableObject>{})

export default class TabsStore extends AbstractStore{
	static data:MutableObject = get(store)

	static get focused() {
		return TabsStore.data.focused
	}
	static set focused(data) {
		TabsStore.updateStore({...TabsStore.data, focused: data})
	}

	static getStore(onChange) {
		return store.subscribe(newValue => onChange(newValue))
	}

	static updateStore(value ?:MutableObject) {
		const V = value||TabsStore.data
		TabsStore.data = V
		store.set(V)
		super.updateStore()

	}

	static update(direction, group, value) {
		ChangesTrackerStore.updateStore(true)
		const clone = {...TabsStore.data}
		if (!clone[SettingsStore.data.currentView])
			clone[SettingsStore.data.currentView] = {}

		if (group !== undefined) {
			if (!clone[SettingsStore.data.currentView][direction])
				clone[SettingsStore.data.currentView][direction] = {}
			clone[SettingsStore.data.currentView][direction][group] = value
		} else
			clone[SettingsStore.data.currentView][direction] = value


		TabsStore.data = clone
		store.set(clone)
		super.updateStore()

	}

	static getValue(direction, group?:string):number {
		let value
		if (group !== undefined)
			value = TabsStore.data[SettingsStore.data.currentView]?.[direction]?.[group]
		else
			value = TabsStore.data[SettingsStore.data.currentView]?.[direction]
		return value === undefined ? 0 : value
	}
}

