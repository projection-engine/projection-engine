import GridSystem from "./runtime/GridSystem"
import IconsSystem from "./runtime/IconsSystem"
import GizmoSystem from "./runtime/GizmoSystem"
import SelectedSystem from "./runtime/SelectedSystem"
import Engine from "../Engine"
import CameraTracker from "./lib/CameraTracker"
import WireframeRenderer from "./runtime/WireframeRenderer"

import ENVIRONMENT from "../static/ENVIRONMENT"
import LineRenderer from "./runtime/LineRenderer"
import Entity from "../instances/Entity"
import GPU from "../GPU"
import StaticEditorMeshes from "./lib/StaticEditorMeshes"
import StaticEditorShaders from "./lib/StaticEditorShaders"
import StaticFBO from "../lib/StaticFBO"
import SettingsStore from "../../frontend/shared/stores/SettingsStore"

export default class EngineTools {
	static selected: Entity[] = []
	static #initialized = false

	static async initialize() {
		if (EngineTools.#initialized)
			return

		EngineTools.#initialized = true
		StaticEditorShaders.initialize()
		await StaticEditorMeshes.initialize()

		Engine.environment = ENVIRONMENT.DEV
		GizmoSystem.initialize()
		LineRenderer.initialize()
	}

	static updateSelectionData(data: string[]) {
		const selected = EngineTools.selected
		for (let i = 0; i < selected.length; i++) {
			const entity = selected[i]
			entity.__isSelected = false
		}

		selected.length = 0
		for (let i = 0; i < data.length; i++){
			const d = data[i]
			const entity = Engine.entities.get(d)
			if (entity !== undefined) {
				selected.push(entity)
				entity.__isSelected = true
			}
		}

		const main = selected[0]
		if (main)
			GizmoSystem.linkEntityToGizmo(main)
		else {
			GizmoSystem.targetRotation = undefined
			GizmoSystem.mainEntity = undefined
			GizmoSystem.hasStarted = false
		}
	}

	static drawIconsToBuffer() {
		GPU.context.disable(GPU.context.DEPTH_TEST)
		StaticFBO.visibility.use()
		StaticEditorShaders.iconToDepth.bind()
		GPU.context.activeTexture(GPU.context.TEXTURE0)
		GPU.context.bindTexture(GPU.context.TEXTURE_2D, IconsSystem.iconsTexture)
		IconsSystem.loop(IconsSystem.drawIcon, SettingsStore.data, StaticEditorShaders.iconToDepthUniforms)
		StaticFBO.visibility.stopMapping()
		GPU.context.enable(GPU.context.DEPTH_TEST)
	}

	static bindSystems() {
		Engine.addSystem("camera_tracker", CameraTracker.updateFrame)
		Engine.addSystem("outline_draw_to_buffer", SelectedSystem.drawToBuffer)
		Engine.addSystem("set_context_state", EngineTools.#setContextState)
		Engine.addSystem("grid", GridSystem.execute)
		Engine.addSystem("wireframe", WireframeRenderer.execute)
		Engine.addSystem("outline_draw_silhouette", SelectedSystem.drawSilhouette)
		Engine.addSystem("icons", IconsSystem.execute)
		Engine.addSystem("gizmo", GizmoSystem.execute)
	}

	static unbindSystems() {
		Engine.removeSystem("camera_tracker")
		Engine.removeSystem("outline_draw_to_buffer")
		Engine.removeSystem("set_context_state")
		Engine.removeSystem("grid")
		Engine.removeSystem("wireframe")
		Engine.removeSystem("outline_draw_silhouette")
		Engine.removeSystem("icons")
		Engine.removeSystem("gizmo")
	}

	static #setContextState() {
		const context = GPU.context
		context.clear(context.DEPTH_BUFFER_BIT)
		context.disable(context.CULL_FACE)
		context.disable(context.DEPTH_TEST)
	}
}