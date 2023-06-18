import FilesStore from "../../../../shared/stores/FilesStore"
import componentConstructor from "../../../utils/component-constructor"
import COMPONENTS from "../../../../../engine-core/static/COMPONENTS"
import EngineResourceLoaderService from "../../../services/engine/EngineResourceLoaderService"
import ToastNotificationSystem from "../../../../shared/components/alert/ToastNotificationSystem"

import FileSystemAPI from "../../../../../engine-core/lib/utils/FileSystemAPI"
import LocalizationEN from "../../../../../shared/LocalizationEN";

export default async function handleComponentDrop(entity, data) {
	try {
		const id = JSON.parse(data)[0]
		let type = "SCRIPT"
		let itemFound = FilesStore.data.components.find(s => s.registryID === id)

		if (!itemFound) {
			itemFound = FilesStore.data.meshes.find(s => s.registryID === id)
			type = "MESH"
		}
		if (!itemFound) {
			itemFound = FilesStore.data.textures.find(s => s.registryID === id)
			type = "IMAGE"
		}
		if (!itemFound) {
			itemFound = FilesStore.data.materials.find(s => s.registryID === id)
			type = "MATERIAL"
		}

		if (!itemFound){
			ToastNotificationSystem.getInstance().error(LocalizationEN.FILE_NOT_FOUND)
			return
		}

		switch (type) {
		case "SCRIPT":
			await componentConstructor(entity, id, true)

			break
		case "MESH":
			if (!entity.meshComponent) {
				entity.addComponent(COMPONENTS.MESH)
				entity.addComponent(COMPONENTS.CULLING)
			}

			await EngineResourceLoaderService.load(id, true)
			entity.meshComponent.meshID = id
			break
		case "MATERIAL": {
			entity.meshComponent.materialID = id
			break
		}
		case "IMAGE": {
			(entity.addComponent(COMPONENTS.SPRITE)).imageID = await FileSystemAPI.loadTexture(id)
			break
		}
		default:
			break
		}
	} catch (err) {
		console.error(err)
	}

}