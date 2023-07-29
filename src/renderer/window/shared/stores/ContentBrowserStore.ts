import AbstractStore from "./AbstractStore"

export default class ContentBrowserStore extends AbstractStore{
	constructor() {
		super({
			selectedItems: [],
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
	}

	static setContentBrowserSelected(data:MutableObject[]) {
		ContentBrowserStore.updateStore({selectedItems: data})
	}

	static getContentBrowserSelected():MutableObject[] {
		return ContentBrowserStore.getData().selectedItems
	}

	static getItemById(id:string){
		return ContentBrowserStore.getData().items.find(item => item.id === id)
	}

}
