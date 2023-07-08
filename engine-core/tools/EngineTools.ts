import GridSystem from "./icons/GridSystem"
import IconsSystem from "./icons/IconsSystem"
import GizmoSystem from "./gizmo/GizmoSystem"
import SelectedSystem from "./outline/SelectedSystem"
import Engine from "../core/Engine"
import CameraTracker from "./utils/CameraTracker"
import WireframeRenderer from "./outline/WireframeRenderer"
import ENVIRONMENT from "../core/static/ENVIRONMENT"
import LineRenderer from "./icons/LineRenderer"
import Entity from "../core/instances/Entity"
import GPU from "../core/GPU"
import StaticEditorMeshes from "./utils/StaticEditorMeshes"
import StaticEditorShaders from "./utils/StaticEditorShaders"
import StaticFBO from "../core/lib/StaticFBO"

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
		for (let i = 0; i < data.length; i++) {
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
		IconsSystem.loop(IconsSystem.drawIcon, StaticEditorShaders.iconToDepthUniforms)
		StaticFBO.visibility.stopMapping()
		GPU.context.enable(GPU.context.DEPTH_TEST)
	}

	static #loop() {
		CameraTracker.updateFrame()
		SelectedSystem.drawToBuffer()
		EngineTools.#setContextState()
		GridSystem.execute()
		WireframeRenderer.execute()
		SelectedSystem.drawSilhouette()
		IconsSystem.execute()
		GizmoSystem.execute()
	}

	static bindSystems() {
		Engine.addSystem("ENGINE_TOOLS_RENDERER", EngineTools.#loop)
	}

	static unbindSystems() {
		Engine.removeSystem("ENGINE_TOOLS_RENDERER")
	}

	static #setContextState() {
		const context = GPU.context
		context.clear(context.DEPTH_BUFFER_BIT)
		context.disable(context.CULL_FACE)
		context.disable(context.DEPTH_TEST)
	}
}