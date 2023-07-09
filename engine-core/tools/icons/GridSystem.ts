import GPU from "../../core/GPU"
import StaticFBO from "../../core/lib/StaticFBO"
import StaticMeshes from "../../core/lib/StaticMeshes"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import EngineToolsState from "../EngineToolsState"

export default class GridSystem {
	static #buffer = new Float32Array([.3, 20, 50, 1])

	static execute() {
		const context = GPU.context
		if(!EngineToolsState.showGrid)
			return

		StaticEditorShaders.grid.bind()
		const uniforms = StaticEditorShaders.gridUniforms
		const buffer = GridSystem.#buffer
		buffer[0] = EngineToolsState.gridColor
		buffer[1] = EngineToolsState.gridScale
		buffer[2] = EngineToolsState.gridThreshold
		buffer[3] = EngineToolsState.gridOpacity


		context.uniform4fv(uniforms.settings, buffer)

		context.activeTexture(context.TEXTURE0)
		context.bindTexture(context.TEXTURE_2D, StaticFBO.sceneDepthVelocity)
		context.uniform1i(uniforms.sceneDepth, 0)

		context.uniform2fv(uniforms.resolution, GPU.bufferResolution)

		StaticMeshes.plane.draw()
	}
}