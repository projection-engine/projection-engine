import LineRenderingManager from "@engine-core/managers/LineRenderingManager"
import GPUState from "@engine-core/states/GPUState"
import StaticFBOState from "@engine-core/states/StaticFBOState"
import StaticEditorShaders from "../state/StaticEditorShaders"
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

			GPUState.context.uniform1i(lineUniforms.darker, darker)
			GPUState.context.uniform1f(lineUniforms.size, size)
			GPUState.context.uniform1i(lineUniforms.atOrigin, atOrigin)

			GPUUtil.bind2DTextureForDrawing(lineUniforms.sceneDepth, 0, StaticFBOState.sceneDepthVelocity)
			finished = false
		} else if (needsStateUpdate) {
			GPUState.context.uniform1i(lineUniforms.darker, darker)
			GPUState.context.uniform1f(lineUniforms.size, size)
			GPUState.context.uniform1i(lineUniforms.atOrigin, atOrigin)
			needsStateUpdate = false
		}
	}

	static drawX(matrix) {
		LineRenderer.#bind()
		GPUState.context.uniform3fv(lineUniforms.axis, X)
		GPUState.context.uniformMatrix4fv(lineUniforms.transformMatrix, false, matrix)
		LineRenderingManager.drawX()
	}

	static drawY(matrix) {
		LineRenderer.#bind()
		GPUState.context.uniform3fv(lineUniforms.axis, Y)
		GPUState.context.uniformMatrix4fv(lineUniforms.transformMatrix, false, matrix)
		LineRenderingManager.drawY()
	}

	static drawZ(matrix) {
		LineRenderer.#bind()
		GPUState.context.uniform3fv(lineUniforms.axis, Z)
		GPUState.context.uniformMatrix4fv(lineUniforms.transformMatrix, false, matrix)
		LineRenderingManager.drawZ()
	}
}
