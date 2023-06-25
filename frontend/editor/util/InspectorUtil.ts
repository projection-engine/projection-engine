import LocalizationEN from "../../../shared/LocalizationEN"
import FilesStore from "../../stores/FilesStore"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import COMPONENTS from "../../../engine-core/static/COMPONENTS"
import EngineResourceLoaderService from "../services/engine/EngineResourceLoaderService"
import FileSystemAPI from "../../../engine-core/lib/utils/FileSystemAPI"
import EntityHierarchyService from "../services/engine/EntityHierarchyService"
import SelectionStore from "../../stores/SelectionStore"
import LightComponent from "../../../engine-core/instances/components/LightComponent"
import LightsAPI from "../../../engine-core/lib/utils/LightsAPI"
import EditorActionHistory from "../services/EditorActionHistory"
import CameraComponent from "../../../engine-core/instances/components/CameraComponent"
import EngineStore from "../../stores/EngineStore"
import CameraAPI from "../../../engine-core/lib/utils/CameraAPI"
import EditorUtil from "./EditorUtil"

export default class InspectorUtil {
	static compareObjects(obj1, obj2) {
		let isValid = true
		Object.entries(obj1).forEach(([k, v]) => {
			if (k === "value")
				return

			if (typeof obj2[k] === "object")
				isValid = isValid && InspectorUtil.compareObjects(v, obj2[k])
			else if (obj2[k] === v)
				isValid = isValid && true

		})
		return isValid
	}

	static getEntityTabs(components) {
		return [

			{
				icon: "settings",
				label: LocalizationEN.ENTITY_PROPERTIES,
				index: -1,
				color: "var(--pj-accent-color-secondary)"
			},
			{
				icon: "code",
				label: LocalizationEN.CUSTOM_COMPONENTS,
				index: -2,
				color: "var(--pj-accent-color-secondary)"
			},
			{divider: true},
			...components.map((c, i) => ({
				icon: EditorUtil.getComponentIcon(c.componentKey),
				label: EditorUtil.getComponentLabel(c.componentKey),
				index: i, color: "var(--pj-accent-color-tertiary)"
			}))
		]
	}

	static updateEntityComponent(savedState, setSaved, entity, key, value, save, component) {
		if (component instanceof LightComponent) {
			entity.needsLightUpdate = true
			LightsAPI.packageLights(true)
		}
		if (!savedState) {
			EditorActionHistory.save(entity)
			setSaved(true)
		}
		if (component instanceof CameraComponent) {
			entity.__cameraNeedsUpdate = true
		}
		component[key] = value
		if (component.componentKey === COMPONENTS.CAMERA && entity.id === EngineStore.getInstance().data.focusedCamera)
			CameraAPI.updateViewTarget(entity)
		if (save) {
			const selectionStoreInstance = SelectionStore.getInstance()
			selectionStoreInstance.updateStore({array: selectionStoreInstance.data.array})
			EditorActionHistory.save(entity)
		}
	}

	static removeComponent(entity, index, key) {
		if (!entity)
			return
		if (index != null) {
			entity.scripts[index] = undefined
			entity.scripts = entity.scripts.filter(e => e)
		} else
			entity.removeComponent(key)

		EntityHierarchyService.updateHierarchy()
		SelectionStore.getInstance().updateStore()
	}

	static async handleComponentDrop(entity, data) {
		try {
			const id = JSON.parse(data)[0]
			const type = InspectorUtil.#getItemFound(id)
			if (type == null)
				return

			switch (type) {
			case "SCRIPT":
				await EditorUtil.componentConstructor(entity, id, true)
				break
			case "MESH":
				if (!entity.meshComponent) {
					entity.addComponent(COMPONENTS.MESH)
					entity.addComponent(COMPONENTS.CULLING)
				}
				await EngineResourceLoaderService.load(id, true)
				entity.meshComponent.meshID = id
				break
			case "MATERIAL":
				entity.meshComponent.materialID = id
				break
			case "IMAGE":
				(entity.addComponent(COMPONENTS.SPRITE)).imageID = await FileSystemAPI.loadTexture(id)
				break
			}
		} catch (err) {
			console.error(err)
		}

	}

	static #getItemFound(id) {
		const filesStoreData = FilesStore.getInstance().data
		let type = "SCRIPT"
		let itemFound = filesStoreData.components.find(s => s.registryID === id)
		if (!itemFound) {
			itemFound = filesStoreData.meshes.find(s => s.registryID === id)
			type = "MESH"
		}
		if (!itemFound) {
			itemFound = filesStoreData.textures.find(s => s.registryID === id)
			type = "IMAGE"
		}
		if (!itemFound) {
			itemFound = filesStoreData.materials.find(s => s.registryID === id)
			type = "MATERIAL"
		}

		if (!itemFound) {
			ToastNotificationSystem.getInstance().error(LocalizationEN.FILE_NOT_FOUND)
			return null
		}
		return type
	}


}