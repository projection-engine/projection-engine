import {get, writable} from "svelte/store"
import AbstractStore from "./AbstractStore"


const store = writable(<MutableObject>{})

export default class TabsStore extends AbstractStore{
	static data:MutableObject = get(store)

	static getStore(onChange) {
		return store.subscribe(newValue => onChange(newValue))
	}

	static updateStore(value ?:MutableObject) {
		const V = value||TabsStore.data
		TabsStore.data = V
		store.set(V)
		super.updateStore()

	}

}

