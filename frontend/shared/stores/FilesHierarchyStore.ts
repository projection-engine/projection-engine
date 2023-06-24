import {get, writable} from "svelte/store"
import FilesStore from "./FilesStore"
import FileSystemService from "../lib/FileSystemService"
import AbstractStore from "./AbstractStore"

const store = writable({items: [], open: {}})

export default class FilesHierarchyStore extends AbstractStore{
	static data = get(store)

	static getStore(onChange) {
		return store.subscribe(newValue => onChange(newValue))
	}

	static updateStore(value = FilesHierarchyStore.data) {
		if(value.open !== FilesHierarchyStore.data.open){
			FilesHierarchyStore.update()
			return
		}
		FilesHierarchyStore.data = value
		store.set(value)
		super.updateStore()
	}

	static update(items=FilesStore.data.items) {
		if(!items)
			return
		const open = FilesHierarchyStore.data.open
		const folders = items.filter(item => item.isFolder)
		const cache:MutableObject = {
			[FileSystemService.getInstance().sep]: {
				depth: 0,
				item: {id: FileSystemService.getInstance().sep, name: "Assets", isFolder: true},
				childQuantity: folders.length
			}
		}

		if (open[FileSystemService.getInstance().sep])
			folders.filter(item => !item.parent).forEach(item => {
				this.#getHierarchy(cache, item, 1, folders)
			})

		FilesHierarchyStore.updateStore({...FilesHierarchyStore.data, items: Object.values(cache)})
	}
	static #getHierarchy(cache, item, depth = 0, folders) {
		cache[item.id] = <MutableObject>{item, depth, childQuantity: 0, children: []}
		const isOpen = open[item.id]
		for (let i = 0; i < folders.length; i++) {
			const current = folders[i]
			if (current.parent === item.id && !cache[current.id]) {
				cache[item.id].childQuantity++
				cache[item.id].children.push(current.id)
				if (isOpen)
					FilesHierarchyStore.#getHierarchy(cache, current, depth + 1, folders)
			}
		}
	}
}

