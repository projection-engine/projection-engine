import GPU from "../../core/GPU"

import StaticMeshes from "../../core/lib/StaticMeshes"
import StaticFBO from "../../core/lib/StaticFBO"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import EngineTools from "../EngineTools"
import EngineToolsState from "../EngineToolsState"
import GPUUtil from "../../core/utils/GPUUtil";


const fallbackColor = new Float32Array([.5, .5, .5])
const metadata = new Float32Array(9)
export default class SelectedSystem {
	static drawToBuffer() {
		const selected = EngineTools.selected
		const context = GPU.context
		const length = selected.length
		if (length > 0) {
			StaticFBO.postProcessing1.startMapping()
			StaticEditorShaders.silhouette.bind()
			const uniforms = StaticEditorShaders.silhouetteUniforms
			for (let m = 0; m < length; m++) {
				const current = selected[m]
				if (!current || !current.active)
					continue

				metadata[6] = current.pickID[0]
				metadata[7] = current.pickID[1]
				metadata[8] = current.pickID[2]

				const sprite = current.spriteComponent
				const mesh = current.meshRef
				metadata[0] = sprite && !mesh ? 1 : 0

				context.uniformMatrix4fv(uniforms.transformMatrix, false, current.matrix)

				if (mesh) {
					context.uniformMatrix3fv(uniforms.metadata, false, metadata)
					mesh.draw()
				} else if (sprite) {
					metadata[1] = sprite.attributes[0]
					metadata[2] = sprite.attributes[1]
					metadata[3] = current.scaling[0]
					metadata[4] = current.scaling[1]
					metadata[5] = current.scaling[2]
					context.uniformMatrix3fv(uniforms.metadata, false, metadata)
					StaticMeshes.drawQuad()
				}
			}
			StaticFBO.postProcessing1.stopMapping()
		} else
			StaticFBO.postProcessing1.clear()
	}

	static drawSilhouette( ) {
		const context = GPU.context

		StaticEditorShaders.outline.bind()
		const outlineShaderUniforms = StaticEditorShaders.outlineUniforms
		context.uniform2fv(outlineShaderUniforms.bufferSize, GPU.bufferResolution)
		context.uniform1f(outlineShaderUniforms.outlineWidth, EngineToolsState.outlineWidth)
		if (EngineToolsState.showOutline) {
			GPUUtil.bind2DTextureForDrawing(outlineShaderUniforms.silhouette, 0, StaticFBO.entityIDSampler)

			context.uniform1i(outlineShaderUniforms.isOutline, 1)
			context.uniform3fv(outlineShaderUniforms.outlineColor, EngineToolsState.outlineColor || fallbackColor)

			StaticMeshes.drawQuad()
		}
	}
}
