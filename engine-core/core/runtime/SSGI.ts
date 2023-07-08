import GPU from "../GPU"
import StaticMeshes from "../lib/StaticMeshes"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import Framebuffer from "../instances/Framebuffer"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import EngineState from "../EngineState"

let cleared = false
export default class SSGI {
	static uniformSettings = new Float32Array(3)
	static execute() {
		if (!EngineState.ssgiEnabled) {
			if (!cleared) {
				StaticFBO.ssgi.clear()
				cleared = true
			}
			return
		}
		cleared = false
		const context = GPU.context
		const uniforms = StaticShaders.ssgiUniforms
		StaticFBO.ssgi.startMapping()
		StaticShaders.ssgi.bind()

		context.activeTexture(context.TEXTURE0)
		context.bindTexture(context.TEXTURE_2D, StaticFBO.sceneDepthVelocity)
		context.uniform1i(uniforms.sceneDepth, 0)

		context.activeTexture(context.TEXTURE1)
		context.bindTexture(context.TEXTURE_2D, StaticFBO.postProcessing2Sampler)
		context.uniform1i(uniforms.previousFrame, 1)

		context.uniform3fv(uniforms.rayMarchSettings, SSGI.uniformSettings)

		StaticMeshes.drawQuad()
		SSGI.#applyBlur(context, StaticFBO.ssgiFallback, StaticFBO.ssgiSampler, true)
		SSGI.#applyBlur(context, StaticFBO.ssgi, StaticFBO.ssgiFallbackSampler, false)

		MetricsController.currentState = METRICS_FLAGS.SSGI
	}

	static #applyBlur(context: WebGL2RenderingContext, FBO: Framebuffer, color: WebGLTexture, first: boolean) {
		const uniforms = StaticShaders.bilateralBlurUniforms


		if (first) {
			StaticShaders.bilateralBlur.bind()

			context.uniform1f(uniforms.blurRadius, EngineState.ssgiBlurRadius)
			context.uniform1i(uniforms.samples, EngineState.ssgiBlurSamples)
			context.uniform2fv(uniforms.bufferResolution, StaticFBO.ssgiFallback.resolution)

			context.activeTexture(context.TEXTURE0)
			context.bindTexture(context.TEXTURE_2D, StaticFBO.entityIDSampler)
			context.uniform1i(uniforms.entityIDSampler, 0)
		}
		else
			context.uniform1i(uniforms.samples, EngineState.ssgiBlurSamples/2)
		FBO.startMapping()

		context.activeTexture(context.TEXTURE1)
		context.bindTexture(context.TEXTURE_2D, color)
		context.uniform1i(uniforms.sceneColor, 1)

		StaticMeshes.drawQuad()
		FBO.stopMapping()
	}
}