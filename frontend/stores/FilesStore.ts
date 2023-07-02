import AbstractStore from "./AbstractStore"

export default class FilesStore extends AbstractStore{
	constructor() {
		super({
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
}