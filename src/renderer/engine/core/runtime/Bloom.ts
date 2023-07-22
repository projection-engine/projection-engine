import GPU from "../GPU"
import CameraAPI from "../lib/utils/CameraAPI"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import StaticMeshes from "../lib/StaticMeshes"
import Framebuffer from "../instances/Framebuffer"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import GPUUtil from "../utils/GPUUtil";

export default class Bloom {
	static #upSample(fbo: Framebuffer, context: WebGL2RenderingContext, nextSampler: WebGLTexture, blurredSampler: WebGLTexture) {
		const upSamplingShaderUniforms = StaticShaders.upSamplingUniforms
		fbo.startMapping()

		GPUUtil.bind2DTextureForDrawing(upSamplingShaderUniforms.nextSampler, 0, nextSampler)
		GPUUtil.bind2DTextureForDrawing(upSamplingShaderUniforms.blurred, 1, blurredSampler)

		context.uniform1f(upSamplingShaderUniforms.sampleScale, CameraAPI.bloomOffset)
		StaticMeshes.drawQuad()
		fbo.stopMapping()
	}

	static execute() {

		const context = GPU.context
		if (!CameraAPI.bloom)
			return
		StaticFBO.lens.startMapping()
		StaticShaders.bloom.bind()
		GPUUtil.bind2DTextureForDrawing(StaticShaders.bloomUniforms.sceneColor, 0, StaticFBO.postProcessing1Sampler)

		context.uniform1f(StaticShaders.bloomUniforms.threshold, CameraAPI.bloomThreshold)
		StaticMeshes.drawQuad()
		StaticFBO.lens.stopMapping()

		StaticShaders.gaussian.bind()
		const downscale = StaticFBO.downscaleBloom
		const upscale = StaticFBO.upscaleBloom

		for (let i = 0; i < downscale.length; i++) {
			const fbo = downscale[i]
			fbo.startMapping()
			GPUUtil.bind2DTextureForDrawing(StaticShaders.gaussianUniforms.sceneColor, 0, i > 0 ? downscale[i - 1].colors[0] : StaticFBO.lensSampler)

			context.uniform1f(StaticShaders.gaussianUniforms.blurRadius, 10)
			context.uniform1i(StaticShaders.gaussianUniforms.samples, CameraAPI.bloomQuality)
			context.uniform2fv(StaticShaders.gaussianUniforms.bufferResolution, fbo.resolution)

			StaticMeshes.drawQuad()
			fbo.stopMapping()
		}


		StaticShaders.upSampling.bind()

		for (let i = 0; i < upscale.length; i++) {
			const fbo = upscale[i]
			Bloom.#upSample(fbo, context, i > 0 ? upscale[i - 1].colors[0] : undefined, downscale[downscale.length - 1 - i].colors[0])
		}
		Bloom.#upSample(StaticFBO.postProcessing2, context, StaticFBO.postProcessing1Sampler, upscale[upscale.length - 1].colors[0])
		MetricsController.currentState = METRICS_FLAGS.BLOOM
	}

}
