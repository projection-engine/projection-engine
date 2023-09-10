import Engine from "../../../engine/core/Engine"
import EditorCameraSystem from "../../../engine/tools/systems/EditorCameraSystem"
import EngineTools from "../../../engine/tools/EngineTools"
import CameraManager from "@engine-core/managers/CameraManager"
import EngineResources from "../../../engine/core/lib/EngineResources"
import AbstractSingleton from "../../../engine/core/AbstractSingleton"
import EngineStore from "../../shared/stores/EngineStore"
import SettingsStore from "../../shared/stores/SettingsStore"
import VisualsStore from "../../shared/stores/VisualsStore"
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore"
import UIManager from "@engine-core/managers/UIManager"
import GPUState from "@engine-core/states/GPUState"
import EngineToolsState from "../../../engine/tools/state/EngineToolsState"
import EngineState from "@engine-core/states/EngineState"
import GizmoState from "../../../engine/tools/state/GizmoState"
import {Environment,} from "@engine-core/engine.enum";

export default class EngineToolsService extends AbstractSingleton {

	constructor() {
		super()
		EntitySelectionStore.getInstance()
			.addListener("EngineToolsService", EngineToolsService.#updateSelection)
		EngineStore.getInstance()
			.addListener("EngineToolsService", EngineToolsService.#updateCameraTracker)
		SettingsStore.getInstance()
			.addListener("EngineToolsService_camera", EngineToolsService.#updateWithSettings)
		VisualsStore.getInstance()
			.addListener("EngineToolsService", EngineToolsService.#updateEngineSettings)
	}

	static #updateSelection() {
		EngineTools.updateSelectionData(EntitySelectionStore.getEntitiesSelected())
	}

	static #updateEngineState() {
		const visualSettings = VisualsStore.getData()
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

	static 	#updateEngineSettings() {
		const visualSettings = VisualsStore.getData()
		GPUState.canvas.width = visualSettings.resolutionX
		GPUState.canvas.height = visualSettings.resolutionY

		if (Engine.environment === Environment.DEV)
			EngineTools.bindSystems()
		else
			EngineTools.unbindSystems()
		EngineToolsService.#updateEngineState()
	}

	static #updateCameraTracker() {
		const engine = EngineStore.getData()
		const settings = SettingsStore.getData()
		if (engine.executingAnimation)
			UIManager.showUI()
		if (Engine.environment === Environment.DEV && !engine.focusedCamera) {
			EngineState.cameraEntityTarget = undefined
			if (settings.camera !== undefined) {
				EditorCameraSystem.updateProperties({
					screenSpaceMovementSpeed: settings.camera.screenSpaceMovementSpeed || 1,
					movementSpeed: settings.camera.movementSpeed * .1,
					turnSpeed: settings.camera.turnSpeed * .01
				})

				if (settings.camera.smoothing != null)
					CameraManager.translationSmoothing = settings.screenSpaceMovement ? 0 : settings.camera.smoothing * .001
				CameraManager.updateViewTarget(settings.camera)
			}
		}
	}

	static 	#updateEngineToolsState() {
		const settings = SettingsStore.getData()
		EngineToolsState.gridColor = settings.gridColor
		EngineToolsState.gridScale = settings.gridScale * 10
		EngineToolsState.gridThreshold = settings.gridThreshold
		EngineToolsState.gridOpacity = settings.gridOpacity
		EngineToolsState.showGrid = settings.showGrid
		EngineToolsState.showIcons = settings.showIcons
		EngineToolsState.showLines = settings.showLines
		EngineToolsState.iconScale = settings.iconScale
		EngineToolsState.showOutline = settings.showOutline
		EngineToolsState.outlineColor = settings.outlineColor
		EngineToolsState.outlineWidth = settings.outlineWidth
	}

	static #updateWithSettings() {
		const settings = SettingsStore.getData()
		EngineState.debugShadingModel = settings.shadingModel
		GizmoState.rotationGridSize = settings.gizmoGrid.rotationGizmo || 1
		GizmoState.translationGridSize = settings.gizmoGrid.translationGizmo || 1
		GizmoState.scalingGridSize = settings.gizmoGrid.scaleGizmo || 1
		GizmoState.transformationType = settings.transformationType
		GizmoState.sensitivity =settings?.gizmoGrid?.sensitivity / 100 || .001
		GizmoState.gizmoType =settings.gizmo
		EngineToolsService.#updateCameraTracker()
		EngineToolsService.#updateEngineToolsState()
		CameraManager.isOrthographic = settings.camera.ortho
	}
}
