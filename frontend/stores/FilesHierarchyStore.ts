import {writable} from "svelte/store"
import AbstractStore from "./AbstractStore"
import ContentBrowserUtil from "../editor/util/ContentBrowserUtil"

const store = writable({items: [], open: {}})

export default class FilesHierarchyStore extends AbstractStore{
	constructor() {
		super({items: [], open: {}})
	}

	updateStore(value) {
		super.updateStoreByKeys({items: ContentBrowserUtil.updateHierarchy(value.items)})
	}
}

