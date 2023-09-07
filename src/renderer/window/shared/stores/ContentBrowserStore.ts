import AbstractStore from "./AbstractStore"
import CONTENT_BROWSER_STATE from "../../editor/static/ContentBrowserStoreState";

export default class ContentBrowserStore extends AbstractStore{
	constructor() {
		super(CONTENT_BROWSER_STATE)
	}

	static setContentBrowserSelected(data:MutableObject[]) {
		ContentBrowserStore.updateStore({selectedItems: data})
	}

	static getContentBrowserSelected():MutableObject[] {
		return ContentBrowserStore.getData().selectedItems
	}

	static getItemById(id:string): MutableObject|undefined{
		return ContentBrowserStore.getData().items.find(item => item.registryID === id)
	}

	static getData(): typeof CONTENT_BROWSER_STATE {
		return this.get<AbstractStore>().data as typeof CONTENT_BROWSER_STATE
	}
}
