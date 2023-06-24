import Engine from "../../../engine-core/Engine"
import CameraTracker from "../../../engine-core/tools/lib/CameraTracker"
import EngineTools from "../../../engine-core/tools/EngineTools"
import CameraAPI from "../../../engine-core/lib/utils/CameraAPI"
import DirectionalShadows from "../../../engine-core/runtime/DirectionalShadows"
import GizmoSystem from "../../../engine-core/tools/runtime/GizmoSystem"
import ENVIRONMENT from "../../../engine-core/static/ENVIRONMENT"
import RotationGizmo from "../../../engine-core/tools/lib/transformation/RotationGizmo"
import TranslationGizmo from "../../../engine-core/tools/lib/transformation/TranslationGizmo"
import ScalingGizmo from "../../../engine-core/tools/lib/transformation/ScalingGizmo"
import GIZMOS from "../static/GIZMOS"
import EngineResources from "../../../engine-core/lib/EngineResources"
import VISUAL_SETTINGS from "../static/VISUAL_SETTINGS"
import AbstractSingleton from "../../../shared/AbstractSingleton"
import EngineStore from "../../shared/stores/EngineStore"
import SettingsStore from "../../shared/stores/SettingsStore"
import VisualsStore from "../../shared/stores/VisualsStore"
import SelectionStore from "../../shared/stores/SelectionStore"
import UIAPI from "../../../engine-core/lib/rendering/UIAPI"
import GPU from "../../../engine-core/GPU"
import SelectionStoreUtil from "../util/SelectionStoreUtil"

export default class EngineToolsService extends AbstractSingleton {

	constructor() {
		super()
		SelectionStore.addListener("EngineToolsService", this.#updateSelection)
		EngineStore.addListener("EngineToolsService", this.#updateCameraTracker)
		SettingsStore.addListener("EngineToolsService_camera", this.#updateCameraTracker)
		SettingsStore.addListener("EngineToolsService_gizmo", this.#updateGizmo)
		VisualsStore.addListener("EngineToolsService", this.#updateEngineSettings)
	}

	#updateSelection(){
		EngineTools.updateSelectionData(SelectionStoreUtil.getEntitiesSelected())
	}

	#updateEngineSettings() {
		const visualSettings = VisualsStore.data
		GPU.canvas.width = visualSettings.resolutionX
		GPU.canvas.height = visualSettings.resolutionY
        
		if (Engine.environment === ENVIRONMENT.DEV)
			EngineTools.bindSystems()
		else
			EngineTools.unbindSystems()
		DirectionalShadows.allocateBuffers(visualSettings.shadowAtlasQuantity, visualSettings.shadowMapResolution)
		EngineResources.updateParams(
			visualSettings,
			visualSettings.SSGI ?? VISUAL_SETTINGS.SSGI,
			visualSettings.SSR ?? VISUAL_SETTINGS.SSR,
			visualSettings.SSS ?? VISUAL_SETTINGS.SSS,
			visualSettings.SSAO ?? VISUAL_SETTINGS.SSAO,
			visualSettings.physicsSimulationStep,
			visualSettings.physicsSubSteps
		)
	}

	#updateCameraTracker() {
		const engine = EngineStore.engine
		const settings = SettingsStore.data
		if (engine.executingAnimation)
			UIAPI.showUI()
		if (Engine.environment === ENVIRONMENT.DEV && !engine.focusedCamera) {
			CameraAPI.trackingEntity = undefined
			if (settings.camera !== undefined) {
				CameraTracker.screenSpaceMovementSpeed = settings.camera.screenSpaceMovementSpeed || 1
				CameraTracker.movementSpeed = settings.camera.movementSpeed * .1
				CameraTracker.turnSpeed = settings.camera.turnSpeed * .01
				if (settings.camera.smoothing != null)
					CameraAPI.translationSmoothing = settings.screenSpaceMovement ? 0 : settings.camera.smoothing * .001
				CameraAPI.updateViewTarget(settings.camera)
			}
		}
	}

	#updateGizmo() {
		const settings = SettingsStore.data
		RotationGizmo.gridSize = settings.gizmoGrid.rotationGizmo || .001
		TranslationGizmo.gridSize = settings.gizmoGrid.translationGizmo || .001
		ScalingGizmo.gridSize = settings.gizmoGrid.scaleGizmo || .001

		GizmoSystem.transformationType = settings.transformationType
		if (settings.gizmoGrid.sensitivity != null)
			GizmoSystem.sensitivity = settings.gizmoGrid.sensitivity
		switch (settings.gizmo) {
		case GIZMOS.TRANSLATION:
			GizmoSystem.targetGizmo = GizmoSystem.translationGizmo
			break
		case GIZMOS.ROTATION:
			GizmoSystem.targetGizmo = GizmoSystem.rotationGizmo
			break
		case GIZMOS.SCALE:
			GizmoSystem.targetGizmo = GizmoSystem.scaleGizmo
			break
		}
	}
}