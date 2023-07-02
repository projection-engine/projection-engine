import Engine from "../../../engine-core/Engine"
import CameraTracker from "../../../engine-core/tools/lib/CameraTracker"
import EngineTools from "../../../engine-core/tools/EngineTools"
import CameraAPI from "../../../engine-core/lib/utils/CameraAPI"
import GizmoSystem from "../../../engine-core/tools/runtime/GizmoSystem"
import ENVIRONMENT from "../../../engine-core/static/ENVIRONMENT"
import RotationGizmo from "../../../engine-core/tools/lib/transformation/RotationGizmo"
import TranslationGizmo from "../../../engine-core/tools/lib/transformation/TranslationGizmo"
import ScalingGizmo from "../../../engine-core/tools/lib/transformation/ScalingGizmo"
import GIZMOS from "../static/GIZMOS"
import EngineResources from "../../../engine-core/lib/EngineResources"
import VISUAL_SETTINGS from "../static/VISUAL_SETTINGS"
import AbstractSingleton from "../../../shared/AbstractSingleton"
import EngineStore from "../../stores/EngineStore"
import SettingsStore from "../../stores/SettingsStore"
import VisualsStore from "../../stores/VisualsStore"
import SelectionStore from "../../stores/SelectionStore"
import UIAPI from "../../../engine-core/lib/rendering/UIAPI"
import GPU from "../../../engine-core/GPU"
import SelectionStoreUtil from "../util/SelectionStoreUtil"
import EngineToolsState from "../../../engine-core/tools/EngineToolsState"
import EngineState from "../../../engine-core/EngineState"

export default class EngineToolsService extends AbstractSingleton {

	constructor() {
		super()
		SelectionStore.getInstance()
			.addListener("EngineToolsService", this.#updateSelection)
		EngineStore.getInstance()
			.addListener("EngineToolsService", this.#updateCameraTracker)
		SettingsStore.getInstance()
			.addListener("EngineToolsService_camera", this.#updateWithSettings)
		VisualsStore.getInstance()
			.addListener("EngineToolsService", this.#updateEngineSettings)
	}

	#updateSelection() {
		EngineTools.updateSelectionData(SelectionStoreUtil.getEntitiesSelected())
	}

	#updateEngineState(visualSettings:typeof VISUAL_SETTINGS) {
		EngineState.fxaaEnabled = visualSettings.FXAA
		EngineState.fxaaSpanMax = visualSettings.FXAASpanMax
		EngineState.fxaaReduceMin = visualSettings.FXAAReduceMin
		EngineState.fxaaReduceMul = visualSettings.FXAAReduceMul
		EngineState.ssgiEnabled = visualSettings.SSGI.enabled
		EngineState.ssgiBlurSamples = visualSettings.SSGI.blurSamples
		EngineState.ssgiBlurRadius = visualSettings.SSGI.blurRadius
		EngineState.ssgiStepSize = visualSettings. SSGI.stepSize
		EngineState.ssgiMaxSteps = visualSettings. SSGI.maxSteps
		EngineState.ssgiStrength = visualSettings. SSGI.strength
		EngineState.ssrFalloff = visualSettings.SSR.falloff
		EngineState.ssrStepSize = visualSettings.SSR.stepSize
		EngineState.ssrMaxSteps = visualSettings.SSR.maxSteps
		EngineState.sssMaxDistance = visualSettings.SSS.maxDistance
		EngineState.sssDepthThickness = visualSettings.SSS.depthThickness
		EngineState.sssEdgeFalloff = visualSettings. SSS.edgeFalloff
		EngineState.sssDepthDelta = visualSettings.SSS.depthDelta
		EngineState.sssMaxSteps = visualSettings.SSS.maxSteps
		EngineState.ssaoEnabled = visualSettings.SSAO.enabled
		EngineState.ssaoFalloffDistance = visualSettings.SSAO.falloffDistance
		EngineState.ssaoRadius = visualSettings.SSAO.radius
		EngineState.ssaoPower = visualSettings.SSAO.power
		EngineState.ssaoBias = visualSettings. SSAO.bias
		EngineState.ssaoBlurSamples = visualSettings.SSAO.blurSamples
		EngineState.ssaoMaxSamples = visualSettings.SSAO.maxSamples
		EngineState.physicsSubSteps = visualSettings.physicsSubSteps
		EngineState.physicsSimulationStep = visualSettings.physicsSimulationStep
		EngineResources.updateParams()
	}

	#updateEngineSettings(visualSettings:typeof VISUAL_SETTINGS) {
		GPU.canvas.width = visualSettings.resolutionX
		GPU.canvas.height = visualSettings.resolutionY

		if (Engine.environment === ENVIRONMENT.DEV)
			EngineTools.bindSystems()
		else
			EngineTools.unbindSystems()
		this.#updateEngineState(visualSettings)
	}

	#updateCameraTracker() {
		const engine = EngineStore.getData()
		const settings = SettingsStore.getData()
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

	#updateEngineToolsState(settings) {
		EngineToolsState.gridColor = settings.gridColor
		EngineToolsState.gridScale = settings.gridScale * 10
		EngineToolsState.gridThreshold = settings.gridThreshold
		EngineToolsState.gridOpacity = settings.gridOpacity
		EngineToolsState.showGrid = settings.showGrid
		EngineToolsState.showIcons = settings.showIcons
		EngineToolsState.showLines = settings.showLines
		EngineToolsState.iconScale = settings.iconScale
	}

	#updateWithSettings(settings) {
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
		this.#updateCameraTracker()
		this.#updateEngineToolsState(settings)
	}
}