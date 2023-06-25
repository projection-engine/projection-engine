import GPU from "../../GPU"
import StaticFBO from "../../lib/StaticFBO"
import StaticMeshes from "../../lib/StaticMeshes"
import StaticEditorShaders from "../lib/StaticEditorShaders"
import SettingsStore from "../../../frontend/stores/SettingsStore"

export default class GridSystem {
	static #buffer = new Float32Array([.3, 20, 50, 1])

	static execute() {
		const context = GPU.context
		const settings = SettingsStore.data
		if(!settings.showGrid)
			return

		StaticEditorShaders.grid.bind()
		const uniforms = StaticEditorShaders.gridUniforms
		const buffer = GridSystem.#buffer
		buffer[0] = settings.gridColor
		buffer[1] = settings.gridScale * 10
		buffer[2] = settings.gridThreshold
		buffer[3] = settings.gridOpacity


		context.uniform4fv(uniforms.settings, buffer)

		context.activeTexture(context.TEXTURE0)
		context.bindTexture(context.TEXTURE_2D, StaticFBO.sceneDepthVelocity)
		context.uniform1i(uniforms.sceneDepth, 0)

		context.uniform2fv(uniforms.resolution, GPU.bufferResolution)

		StaticMeshes.plane.draw()
	}
}