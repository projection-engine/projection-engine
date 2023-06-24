import {get, writable} from "svelte/store"
import AbstractStore from "./AbstractStore"


const store = writable(false)

export default class ChangesTrackerStore extends AbstractStore{
	static data:boolean = get(store)

	static getStore(onChange) {
		return store.subscribe(newValue => onChange(newValue))
	}

	static updateStore(value?:boolean) {
		if(value === ChangesTrackerStore.data)
			return
		ChangesTrackerStore.data = value
		store.set(value)

		super.updateStore()
	}
}

