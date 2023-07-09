import ScriptsAPI from "../../../engine-core/core/lib/utils/ScriptsAPI"
import SelectionStore from "../../stores/SelectionStore"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import LocalizationEN from "../../../shared/enums/LocalizationEN"
import EngineStore from "../../stores/EngineStore"
import Entity from "../../../engine-core/core/instances/Entity"
import Engine from "../../../engine-core/core/Engine"
import ExecutionService from "../services/engine/ExecutionService"
import CameraAPI from "../../../engine-core/core/lib/utils/CameraAPI"
import CameraTracker from "../../../engine-core/tools/utils/CameraTracker"
import COMPONENTS from "../../../engine-core/core/static/COMPONENTS"
import IPCRoutes from "../../../shared/enums/IPCRoutes"
import SettingsStore from "../../stores/SettingsStore"
import QueryAPI from "../../../engine-core/core/lib/utils/QueryAPI"
import GIZMOS from "../../../shared/enums/Gizmos"
import GizmoSystem from "../../../engine-core/tools/gizmo/GizmoSystem"
import {glMatrix} from "gl-matrix"
import ElectronResources from "../../shared/lib/ElectronResources"
import SelectionStoreUtil from "./SelectionStoreUtil"
import TabsStoreUtil from "./TabsStoreUtil"
import ContentBrowserUtil from "./ContentBrowserUtil"

export default class EditorUtil {
	static async componentConstructor(entity, scriptID, autoUpdate = true) {
		await ScriptsAPI.linkScript(entity, scriptID)
		if (autoUpdate)
			SelectionStore.updateStore()
		ToastNotificationSystem.getInstance().success(LocalizationEN.ADDED_COMPONENT)
	}

	static focusOnCamera(cameraTarget) {
		const engineInstance = EngineStore.getInstance()
		const focused = engineInstance.data.focusedCamera
		const isCamera = cameraTarget instanceof Entity
		if (!focused || isCamera && cameraTarget.id !== focused) {
			const current = isCamera ? cameraTarget : Engine.entities.get(SelectionStoreUtil.getMainEntity())
			if (current && current.cameraComponent) {
				ExecutionService.cameraSerialization = CameraAPI.serializeState()
				CameraTracker.stopTracking()
				CameraAPI.updateViewTarget(current)
				engineInstance.updateStore({focusedCamera: current.id})
			}
		} else {
			CameraAPI.restoreState(ExecutionService.cameraSerialization)
			CameraTracker.startTracking()
			engineInstance.updateStore({focusedCamera: undefined})
		}
	}

	static getComponentIcon(key) {
		switch (key) {
		case COMPONENTS.MESH:
			return "category"
		case COMPONENTS.LIGHT:
			return "light_mode"
		case COMPONENTS.CAMERA:
			return "videocam"
		case COMPONENTS.ATMOSPHERE:
			return "wb_twilight"
		case COMPONENTS.LIGHT_PROBE:
			return "lens_blur"
		case "TRANSFORMATION":
			return "transform"
		case COMPONENTS.DECAL:
			return "layers"
		case COMPONENTS.SPRITE:
			return "image"
		case COMPONENTS.PHYSICS_COLLIDER:
			return "compare_arrows"
		case COMPONENTS.RIGID_BODY:
			return "language"
		case COMPONENTS.CULLING:
			return "disabled_visible"
		case COMPONENTS.UI:
			return "widgets"
		default:
			return "code"
		}
	}

	static getComponentLabel(component) {
		switch (component) {
		case COMPONENTS.MESH:
			return LocalizationEN.MESH
		case COMPONENTS.CAMERA:
			return LocalizationEN.CAMERA
		case COMPONENTS.SPRITE:
			return LocalizationEN.SPRITE
		case COMPONENTS.DECAL:
			return LocalizationEN.DECAL
		case COMPONENTS.LIGHT:
			return LocalizationEN.LIGHT
		case COMPONENTS.ATMOSPHERE:
			return LocalizationEN.ATMOSPHERE_RENDERER
		case COMPONENTS.LIGHT_PROBE:
			return LocalizationEN.LIGHT_PROBE
		case COMPONENTS.PHYSICS_COLLIDER:
			return LocalizationEN.PHYSICS_COLLIDER
		case COMPONENTS.RIGID_BODY:
			return LocalizationEN.RIGID_BODY
		case COMPONENTS.CULLING:
			return LocalizationEN.CULLING
		case COMPONENTS.UI:
			return LocalizationEN.UI_WRAPPER
		}
	}

	static async importFile(currentDirectory) {
		const {filesImported} = await EditorUtil.getCall<MutableObject>(IPCRoutes.FILE_DIALOG, {currentDirectory: currentDirectory.id}, false)
		if (filesImported.length > 0) {
			ToastNotificationSystem.getInstance().success(LocalizationEN.IMPORT_SUCCESSFUL)
			await ContentBrowserUtil.refreshFiles()
		}
	}

	static openBottomView(view) {
		const settingsStore = SettingsStore.getInstance()
		const views = [...settingsStore.data.views]
		const tab = views[settingsStore.data.currentView]
		const existingTab = tab.bottom[0].findIndex(v => v?.type === view)
		if (existingTab > -1) {
			TabsStoreUtil.updateByAttributes( "bottom", 0, existingTab)
			return
		}

		if (tab.bottom.length > 0)
			tab.bottom[0].push({type: view, color: [255, 255, 255]})
		else
			tab.bottom[0] = [{type: view, color: [255, 255, 255]}]

		settingsStore.updateStore({views})
		TabsStoreUtil.updateByAttributes("bottom", 0, tab.bottom[0].length - 1)
	}

	static async resolveFileName(path: string, ext: string): Promise<string> {
		return await EditorUtil.getCall(IPCRoutes.RESOLVE_NAME, {path, ext}, false)
	}

	static selectEntityHierarchy(start: Entity): string[] {
		const result: string[] = []
		const direct = start.children.array
		direct.forEach(d => result.push(...EditorUtil.selectEntityHierarchy(d)))
		result.push(...direct.map(c => c.id))
		return result
	}

	static snap(grid?: number) {
		const selected = SelectionStoreUtil.getEntitiesSelected()
		for (let i = 0; i < selected.length; i++) {
			const entity = QueryAPI.getEntityByID(selected[i])
			const currentGizmo = SettingsStore.getData().gizmo

			switch (currentGizmo) {
			case GIZMOS.TRANSLATION: {
				const g = grid ? grid : GizmoSystem.translationGizmo.gridSize
				entity._translation[0] = Math.round(entity._translation[0] / g) * g
				entity._translation[1] = Math.round(entity._translation[1] / g) * g
				entity._translation[2] = Math.round(entity._translation[2] / g) * g
				break
			}
			case GIZMOS.SCALE: {
				const g = grid ? grid : GizmoSystem.scaleGizmo.gridSize
				entity._scaling[0] = Math.round(entity._scaling[0] / g) * g
				entity._scaling[1] = Math.round(entity._scaling[1] / g) * g
				entity._scaling[2] = Math.round(entity._scaling[2] / g) * g
				break
			}
			case GIZMOS.ROTATION: {
				const g = grid ? grid : glMatrix.toRadian(GizmoSystem.rotationGizmo.gridSize)
				entity._rotationQuaternion[0] = Math.round(entity._rotationQuaternion[0] / g) * g
				entity._rotationQuaternion[1] = Math.round(entity._rotationQuaternion[1] / g) * g
				entity._rotationQuaternion[2] = Math.round(entity._rotationQuaternion[2] / g) * g
				entity._rotationQuaternion[3] = Math.round(entity._rotationQuaternion[2] / g) * g
				break
			}
			}
			entity.changed = true
		}
	}

	static updateView(key, newView) {
		const settingsData = SettingsStore.getData()
		const view = settingsData.views[settingsData.currentView]
		const copy = [...settingsData.views]
		copy[settingsData.currentView] = {...view, [key]: newView}

		SettingsStore.updateStore({views: copy})
	}

	static getCall<T>(channel, data, addMiddle = true):Promise<T> {
		return new Promise(resolve => {
			let listenID = crypto.randomUUID()
			if (data.listenID)
				listenID = data.listenID
			ElectronResources.ipcRenderer.once(channel + (addMiddle ? "-" : "") + listenID, (ev, data:T) => {
				resolve(data)
			})

			ElectronResources.ipcRenderer.send(channel, {...data, listenID})
		})
	}
}