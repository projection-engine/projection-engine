import {get, writable} from "svelte/store"
import AbstractStore from "./AbstractStore"
import ContentBrowserUtil from "../../editor/util/ContentBrowserUtil"

const store = writable({items: [], open: {}})

export default class FilesHierarchyStore extends AbstractStore{
	static data = get(store)

	static getStore(onChange) {
		return store.subscribe(newValue => onChange(newValue))
	}

	static updateStore(value = FilesHierarchyStore.data) {
		value.items = ContentBrowserUtil.updateHierarchy(value.items)
		FilesHierarchyStore.data = value
		store.set(value)
	}
}

