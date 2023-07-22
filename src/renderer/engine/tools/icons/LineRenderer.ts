import LineAPI from "../../core/lib/rendering/LineAPI"
import GPU from "../../core/GPU"
import StaticFBO from "../../core/lib/StaticFBO"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import GPUUtil from "../../core/utils/GPUUtil";

const X = new Float32Array([1, 0, 0]), Y = new Float32Array([0, 1, 0]), Z = new Float32Array([0, 0, 1])

let darker = 0, atOrigin = 0, size = 10000
let finished = true, needsStateUpdate = false
let lineUniforms: { [key: string]: WebGLUniformLocation }

export default class LineRenderer {

	static setState(darkerState, atOriginState, sizeState) {
		darker = darkerState ? 1 : 0
		size = sizeState
		atOrigin = atOriginState ? 1 : 0
		needsStateUpdate = true
	}

	static initialize() {
		lineUniforms = StaticEditorShaders.lineUniforms
	}

	static finish() {
		finished = true
	}

	static #bind() {

		if (finished) {
			StaticEditorShaders.line.bind()

			GPU.context.uniform1i(lineUniforms.darker, darker)
			GPU.context.uniform1f(lineUniforms.size, size)
			GPU.context.uniform1i(lineUniforms.atOrigin, atOrigin)

			GPUUtil.bind2DTextureForDrawing(lineUniforms.sceneDepth, 0, StaticFBO.sceneDepthVelocity)
			finished = false
		} else if (needsStateUpdate) {
			GPU.context.uniform1i(lineUniforms.darker, darker)
			GPU.context.uniform1f(lineUniforms.size, size)
			GPU.context.uniform1i(lineUniforms.atOrigin, atOrigin)
			needsStateUpdate = false
		}
	}

	static drawX(matrix) {
		LineRenderer.#bind()
		GPU.context.uniform3fv(lineUniforms.axis, X)
		GPU.context.uniformMatrix4fv(lineUniforms.transformMatrix, false, matrix)
		LineAPI.drawX()
	}

	static drawY(matrix) {
		LineRenderer.#bind()
		GPU.context.uniform3fv(lineUniforms.axis, Y)
		GPU.context.uniformMatrix4fv(lineUniforms.transformMatrix, false, matrix)
		LineAPI.drawY()
	}

	static drawZ(matrix) {
		LineRenderer.#bind()
		GPU.context.uniform3fv(lineUniforms.axis, Z)
		GPU.context.uniformMatrix4fv(lineUniforms.transformMatrix, false, matrix)
		LineAPI.drawZ()
	}
}
