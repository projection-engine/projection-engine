import GPU from "../GPU"
import StaticMeshes from "../lib/StaticMeshes"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import StaticUBOs from "../lib/StaticUBOs"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import EngineState from "../EngineState"
import GPUUtil from "../utils/GPUUtil";


export default class SSAO {
	static noiseScale = new Float32Array(2)

	static async initialize() {
		const RESOLUTION = 4
		SSAO.noiseScale[0] = GPU.internalResolution.w / RESOLUTION
		SSAO.noiseScale[1] = GPU.internalResolution.h / RESOLUTION

		StaticUBOs.ssaoUBO.bind()
		StaticUBOs.ssaoUBO.updateData("settings", new Float32Array([.5, .7, -.1, 1000]))
		StaticUBOs.ssaoUBO.updateData("noiseScale", SSAO.noiseScale)
		StaticUBOs.ssaoUBO.unbind()

		await StaticFBO.generateSSAONoise()
	}

	static #draw() {
		StaticFBO.ssao.startMapping()
		StaticShaders.ssao.bind()


		GPUUtil.bind2DTextureForDrawing(StaticShaders.ssaoUniforms.sceneDepth, 0, StaticFBO.sceneDepthVelocity)

		GPUUtil.bind2DTextureForDrawing(StaticShaders.ssaoUniforms.noiseSampler, 1, StaticFBO.noiseSampler)

		GPU.context.uniform1i(StaticShaders.ssaoUniforms.maxSamples, EngineState.ssaoMaxSamples)

		StaticMeshes.drawQuad()
		StaticFBO.ssao.stopMapping()
	}

	static #blur() {
		StaticShaders.boxBlur.bind()
		StaticFBO.ssaoBlurred.startMapping()

		GPUUtil.bind2DTextureForDrawing(StaticShaders.boxBlurUniforms.sampler, 0, StaticFBO.ssaoSampler)

		GPU.context.uniform1i(StaticShaders.boxBlurUniforms.samples, EngineState.ssaoBlurSamples)

		StaticMeshes.drawQuad()
		StaticFBO.ssaoBlurred.stopMapping()
	}

	static execute() {
		if (!EngineState.ssaoEnabled)
			return

		SSAO.#draw()
		SSAO.#blur()

		MetricsController.currentState = METRICS_FLAGS.SSAO
	}

}

