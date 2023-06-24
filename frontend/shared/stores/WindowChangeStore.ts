import {get, writable} from "svelte/store"
import AbstractStore from "./AbstractStore"


const store = writable(undefined)

export default class WindowChangeStore extends AbstractStore{
	static message:{message: string, callback: Function} = get(store)

	static getStore(onChange) {
		return store.subscribe(newValue => onChange(newValue))
	}

	static updateStore(message?:{message: string, callback: Function}) {
		WindowChangeStore.message = message
		store.set(message)
		super.updateStore()
	}
}

