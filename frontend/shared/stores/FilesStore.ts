import {get, writable} from "svelte/store"
import AbstractStore from "./AbstractStore"

const contentBrowserStore = writable({
	isLoading: true,
	items: [],
	textures: [],
	meshes: [],
	levels: [],
	materials: [],
	materialInstances: [],
	simpleMaterials: [],
	components: [],
	uiLayouts: [],
	terrains: [],
	terrainMaterials: [],
	toCut: [],
	collections: []
})

export default class FilesStore extends AbstractStore{
	static data = get(contentBrowserStore)

	static getStore(onChange) {
		return contentBrowserStore.subscribe(newValue => {
			onChange(newValue)
		})
	}

	static updateStore(value = FilesStore.data) {
		FilesStore.data = value
		contentBrowserStore.set({...value})
		super.updateStore()
	}


}