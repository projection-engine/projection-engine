import SHADING_MODELS from "../../../engine-core/static/SHADING_MODELS"
import LocalizationEN from "../../../shared/LocalizationEN"
import SettingsStore from "../../stores/SettingsStore"
import ConversionAPI from "../../../engine-core/lib/math/ConversionAPI"
import GPU from "../../../engine-core/GPU"
import PickingAPI from "../../../engine-core/lib/utils/PickingAPI"
import Engine from "../../../engine-core/Engine"
import VisibilityRenderer from "../../../engine-core/runtime/VisibilityRenderer"
import EngineTools from "../../../engine-core/tools/EngineTools"
import SelectionStoreUtil from "./SelectionStoreUtil"
import ScalingGizmo from "../../../engine-core/tools/lib/transformation/ScalingGizmo"
import TranslationGizmo from "../../../engine-core/tools/lib/transformation/TranslationGizmo"
import RotationGizmo from "../../../engine-core/tools/lib/transformation/RotationGizmo"
import {glMatrix, quat} from "gl-matrix"
import CameraAPI from "../../../engine-core/lib/utils/CameraAPI"
import CameraTracker from "../../../engine-core/tools/lib/CameraTracker"
import ViewportInteractionListener from "../views/scene-editor/lib/ViewportInteractionListener"
import EngineResourceLoaderService from "../services/engine/EngineResourceLoaderService"
import ContextMenuService from "../../shared/lib/context-menu/ContextMenuService"
import getViewportContext from "../templates/get-viewport-context"
import RENDER_TARGET from "../static/RENDER_TARGET"
import SETTINGS from "../static/SETTINGS"

export default class SceneEditorUtil {
	static #worker?: Worker

	static getLabel(shadingModel): string {
		switch (shadingModel) {
		case SHADING_MODELS.LIGHT_ONLY:
			return "SHADING_LIGHT"
		case SHADING_MODELS.ALBEDO:
			return "SHADING_UNLIT"
		case SHADING_MODELS.NORMAL:
			return "SHADING_NORMAL"
		case SHADING_MODELS.DEPTH:
			return "SHADING_DEPTH"
		case SHADING_MODELS.G_AO:
		case SHADING_MODELS.AO:
			return "SHADING_AO"
		case SHADING_MODELS.RANDOM:
			return "SHADING_RANDOM"
		case SHADING_MODELS.POSITION:
			return "POSITION"
		case SHADING_MODELS.DETAIL:
			return "SHADING_DETAIL"
		case SHADING_MODELS.ROUGHNESS:
			return "SHADING_ROUGHNESS"
		case SHADING_MODELS.METALLIC:
			return "SHADING_METALLIC"
		case SHADING_MODELS.LIGHT_COMPLEXITY:
			return "LIGHT_COMPLEXITY"
		case SHADING_MODELS.UV:
			return "SHADING_UV"
		case SHADING_MODELS.OVERDRAW:
			return "OVERDRAW"
		case SHADING_MODELS.LIGHT_QUANTITY:
			return "LIGHT_QUANTITY"
		default:
			return ""
		}
	}

	static getShadingModels() {
		return [
			{divider: true, label: LocalizationEN.MISC},
			{label: LocalizationEN.SHADING_DETAIL, id: SHADING_MODELS.DETAIL},
			{label: LocalizationEN.LIGHT_QUANTITY, id: SHADING_MODELS.LIGHT_QUANTITY},
			{divider: true, label: LocalizationEN.DEBUG_SHADING},
			{label: LocalizationEN.SHADING_DEPTH, id: SHADING_MODELS.DEPTH},
			{label: LocalizationEN.SHADING_RANDOM, id: SHADING_MODELS.RANDOM},
			{label: LocalizationEN.LIGHT_COMPLEXITY, id: SHADING_MODELS.LIGHT_COMPLEXITY},
			{label: LocalizationEN.POSITION, id: SHADING_MODELS.POSITION},
			{label: LocalizationEN.SHADING_DYNAMIC_AO, id: SHADING_MODELS.AO,},
			{label: LocalizationEN.OVERDRAW, id: SHADING_MODELS.OVERDRAW},
			{divider: true, label: LocalizationEN.MATERIAL},
			{label: LocalizationEN.SHADING_UNLIT, id: SHADING_MODELS.ALBEDO},
			{label: LocalizationEN.SHADING_ROUGHNESS, id: SHADING_MODELS.ROUGHNESS},
			{label: LocalizationEN.LIGHT_ONLY, id: SHADING_MODELS.LIGHT_ONLY}
		].map(e => e.divider ? e : ({
			...e,
			onClick: () => SettingsStore.updateStore({shadingModel: e.id})
		}))
	}

	static getUnderSelectionBox(_, startCoords, endCoords) {
		const worker = SceneEditorUtil.worker()
		if (startCoords && endCoords) {
			EngineTools.drawIconsToBuffer()
			const nStart = ConversionAPI.toQuadCoord(startCoords, GPU.internalResolution)
			const nEnd = ConversionAPI.toQuadCoord(endCoords, GPU.internalResolution)
			try {

				const data = PickingAPI.readBlock(nStart, nEnd)
				worker.postMessage({entities: Engine.entities.array.map(e => ({id: e.id, pick: e.pickIndex})), data}, [data.buffer])
				worker.onmessage = ({data: selected}) => SelectionStoreUtil.setEntitiesSelected(selected)

			} catch (err) {
				console.error(err, startCoords, nStart)
			}

			VisibilityRenderer.needsUpdate = true
		}
	}

	static worker(): Worker {
		if (SceneEditorUtil.#worker)
			return SceneEditorUtil.#worker

		const src = ` 
            self.onmessage = ({data: {entities, data}}) => {
                const map = {}
                for(let i= 0; i < entities.length; i++){
                    const {id, pick} = entities[i]
                    map[Math.round(pick).toString()] = id
                }
                const selected = [], ids = []
                for (let i = 0; i < data.length; i += 4) {
                    const ID =  Math.round(data[i] + data[i + 1] + data[i + 1])
                    const found = map[ID.toString()]
                    if(!found || selected.includes(ID)) 
                        continue
                    selected.push(ID)
                    ids.push(found)
                }
                self.postMessage(ids)
            }
        `
		const workerBlob = new Blob([src], {type: "application/javascript"})
		const workerUrl = URL.createObjectURL(workerBlob)
		SceneEditorUtil.#worker = new Worker(workerUrl)
		return SceneEditorUtil.#worker
	}

	static updateGizmoGrid(key, value)  {
		switch (key) {
		case key === "scalingGizmo":
			ScalingGizmo.gridSize = value
			break
		case key === "translationGizmo":
			TranslationGizmo.gridSize = value
			break
		case key === "rotationGizmo":
			RotationGizmo.gridSize = value * Math.PI / 180
			break
		}
		SettingsStore.updateStore({gizmoGrid: {...SettingsStore.getData().gizmoGrid, [key]: value}})
	}

	static restoreCameraState(viewMetadata){
		if (!viewMetadata.cameraMetadata) {
			const pitch = quat.fromEuler(quat.create(), -45, 0, 0)
			const yaw = quat.fromEuler(quat.create(), 0, 45, 0)
			CameraAPI.update([5, 10, 5], quat.multiply(quat.create(), yaw, pitch))
			CameraTracker.xRotation = glMatrix.toRadian(45)
			CameraTracker.yRotation = -glMatrix.toRadian(45)
		} else {
			CameraAPI.restoreState(viewMetadata.cameraMetadata)
			CameraTracker.xRotation = viewMetadata.cameraMetadata.prevX
			CameraTracker.yRotation = viewMetadata.cameraMetadata.prevY
		}

		viewMetadata.cameraMetadata = CameraAPI.serializeState()
		viewMetadata.cameraMetadata.prevX = CameraTracker.xRotation
		viewMetadata.cameraMetadata.prevY = CameraTracker.yRotation
	}

	static onSceneEditorMount(draggable, viewMetadata){
		ContextMenuService.getInstance().mount(getViewportContext(), RENDER_TARGET)
		if (viewMetadata.cameraMetadata)
			CameraAPI.restoreState(viewMetadata.cameraMetadata)

		CameraTracker.startTracking()
		ViewportInteractionListener.get()
		draggable.onMount({
			targetElement: GPU.canvas,
			onDrop: (data, event) => EngineResourceLoaderService.load(data, false, event.clientX, event.clientY).catch(),
			onDragOver: () => `
                <span data-svelteicon="-" style="font-size: 70px">add</span>
                ${LocalizationEN.DRAG_DROP}
            `
		})
	}

	static getSceneOptions(settings: typeof SETTINGS){
		return [
			{
				label: LocalizationEN.GRID,
				icon: settings.showGrid ? "check" : undefined,
				onClick: () => SettingsStore.updateStore({showGrid: !settings.showGrid})
			},
			{
				label: LocalizationEN.ICONS,
				icon: settings.showIcons ? "check" : undefined,
				onClick: () => SettingsStore.updateStore({showIcons: !settings.showIcons})
			},
			{
				label: LocalizationEN.LINES,
				icon: settings.showLines ? "check" : undefined,
				onClick: () => SettingsStore.updateStore({showLines: !settings.showLines})
			},
			{
				label: LocalizationEN.OUTLINE,
				icon: settings.showOutline ? "check" : undefined,
				onClick: () => SettingsStore.updateStore({showOutline: !settings.showOutline})
			},
		]
	}
}