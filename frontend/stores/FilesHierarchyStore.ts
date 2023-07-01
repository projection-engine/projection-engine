import AbstractStore from "./AbstractStore"
import ContentBrowserUtil from "../editor/util/ContentBrowserUtil"

export default class FilesHierarchyStore extends AbstractStore{
	constructor() {
		super({items: [], open: {}})
	}

	updateStore(value) {
		super.updateStoreByKeys({items: ContentBrowserUtil.updateHierarchy(value.items)})
	}
}

