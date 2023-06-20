import {get, writable} from "svelte/store"

import ContentBrowserAPI from "../../editor/services/file-system/ContentBrowserAPI"
import FilesHierarchyStore from "./FilesHierarchyStore"
import FileSystemService from "../lib/FileSystemService"
import {getCall} from "../util/get-call"
import FSRegistryService from "../../editor/services/file-system/FSRegistryService"
import IPCRoutes from "../../../shared/IPCRoutes"
import LocalizationEN from "../../../shared/LocalizationEN"
import ContentBrowserUtil from "../../editor/util/ContentBrowserUtil"
import EditorUtil from "../../editor/util/EditorUtil"

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

export default class FilesStore {
	static data = get(contentBrowserStore)
	static #initialized = false

	static initializeContentBrowser() {
		if (!FilesStore.#initialized) {
			FilesStore.#initialized = true
			contentBrowserStore.subscribe(data => {
				FilesHierarchyStore.update(data.items)
			})
			FilesStore.refreshFiles().catch()

		}
	}

	static getStore(onChange) {
		return contentBrowserStore.subscribe(newValue => {
			onChange(newValue)
		})
	}

	static async refreshFiles() {
		try {
			let data = <MutableObject[] | null>(await getCall(IPCRoutes.REFRESH_CONTENT_BROWSER, {pathName: FileSystemService.getInstance().path + FileSystemService.getInstance().sep}, false))
			if (!data)
				data = FilesStore.data.items
			await FSRegistryService.readRegistry()
			const fileTypes = await ContentBrowserAPI.refresh()
			FilesStore.updateStore({...FilesStore.data, items: data, ...fileTypes})
		} catch (err) {
			console.error(err)
		}
	}


	static async createFolder(currentDirectory) {
		const path = await EditorUtil.resolveFileName(currentDirectory.id + FileSystemService.getInstance().sep + LocalizationEN.NEW_FOLDER, "")
		await FileSystemService.getInstance().mkdir(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + path)
		await FilesStore.refreshFiles()
	}

	static updateStore(value = FilesStore.data) {
		FilesStore.data = value
		contentBrowserStore.set({...value})
	}


	static paste(target?: string) {
		if (FilesStore.data.toCut.length > 0) {
			ContentBrowserUtil.handleDropFolder(
				[...FilesStore.data.toCut],
				target
			).catch(err => console.error(err))
			FilesStore.data.toCut = []
		}
	}
}