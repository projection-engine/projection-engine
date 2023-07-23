import Engine from "../../../engine/core/Engine"
import ContentBrowserStore from "../../shared/stores/ContentBrowserStore"

export default class SelectorUtil{
	static getIcon(type){
		switch (type) {
		case "image":
			return "image"
		case "material":
			return "fiber_manual_record"
		case "mesh":
			return "category"

		case "ui":
			return "view_quilt"
		case "terrain":
			return "landscape"

		case "code":
			return "code"
		case "parent":
			return "account_tree"
		}
	}

	static getType(type, mergeMaterials, terrainMaterials) {
		const store = ContentBrowserStore.getData()
		switch (type) {
		case "image":
			return store.textures
		case "material":
			if(terrainMaterials)
				return store.terrainMaterials
			if(mergeMaterials)
				return [...store.materials,  ...store.materialInstances]
			return store.materials
		case "mesh":
			return store.meshes

		case "ui":
			return store.uiLayouts
		case "terrain":
			return store.terrains

		case "code":
			return [...store.uiLayouts, ...store.components]
		case "parent":
			return Engine.entities.array
		default:
			return []
		}
	}
}
