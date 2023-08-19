import GPUState from "./GPUState"
import Framebuffer from "@engine-core/lib/resources/Framebuffer"
import ImageProcessor from "../lib/math/ImageProcessor"
import StaticUBOState from "./StaticUBOState"
import EngineState from "./EngineState"
import {ImageWorkerActions,} from "@engine-core/engine.enum";

const RESOLUTION = 4

export default class StaticFBOState {
	static visibility?: Framebuffer
	static sceneDepthVelocity?: WebGLTexture
	static entityIDSampler?: WebGLTexture

	static lens?: Framebuffer
	static lensSampler?: WebGLTexture

	static postProcessing1?: Framebuffer
	static postProcessing1Sampler?: WebGLTexture

	static postProcessing2?: Framebuffer
	static postProcessing2Sampler?: WebGLTexture

	static ssgi?: Framebuffer
	static ssgiSampler?: WebGLTexture

	static ssgiFallback?: Framebuffer
	static ssgiFallbackSampler?: WebGLTexture

	static ssao?: Framebuffer
	static ssaoSampler?: WebGLTexture

	static ssaoBlurred?: Framebuffer
	static ssaoBlurredSampler?: WebGLTexture


	static downscaleBloom: Framebuffer[] = []
	static upscaleBloom: Framebuffer[] = []

	static shadows?: Framebuffer
	static shadowsSampler?: WebGLTexture

	static noiseSampler?: WebGLTexture
	static #initialized = false

	static initialize() {
		if (StaticFBOState.#initialized)
			return
		StaticFBOState.#initialized = true
		const context = GPUState.context
		const halfResW = GPUState.internalResolution.w / 2
		const halfResH = GPUState.internalResolution.h / 2

		StaticFBOState.visibility = (new Framebuffer())
			.texture({
				attachment: 0,
				precision: context.RGBA32F,
				format: context.RGBA,
				label: "DEPTH"
			})
			.texture({
				attachment: 1,
				label: "ENTITY_ID",
				precision: context.RGBA,
				format: context.RGBA,
				type: context.UNSIGNED_BYTE
			})
			.depthTest()


		StaticFBOState.postProcessing1 = new Framebuffer().texture()
		StaticFBOState.postProcessing2 = new Framebuffer().texture().depthTest()

		const linearTexture = {
			linear: true,
			precision: context.RGBA,
			format: context.RGBA,
			type: context.UNSIGNED_BYTE
		}

		StaticFBOState.ssgi = new Framebuffer(halfResW, halfResH).texture(linearTexture)
		StaticFBOState.ssgiFallback = new Framebuffer(halfResW, halfResH).texture(linearTexture)

		const SSAO_SETTINGS = {
			linear: true,
			precision: context.R8,
			format: context.RED,
			type: context.UNSIGNED_BYTE
		}
		StaticFBOState.ssao = new Framebuffer(halfResW, halfResH).texture(SSAO_SETTINGS)
		StaticFBOState.ssaoBlurred = new Framebuffer(halfResW, halfResH).texture(SSAO_SETTINGS)
		StaticFBOState.lens = new Framebuffer().texture()


		const Q = 7
		let w = GPUState.internalResolution.w, h = GPUState.internalResolution.h
		for (let i = 0; i < Q; i++) {
			w /= 2
			h /= 2
			StaticFBOState.downscaleBloom.push((new Framebuffer(w, h)).texture(linearTexture))
		}
		for (let i = 0; i < (Q / 2 - 1); i++) {
			w *= 4
			h *= 4
			StaticFBOState.upscaleBloom.push((new Framebuffer(w, h)).texture(linearTexture))
		}

		StaticFBOState.ssaoBlurredSampler = StaticFBOState.ssaoBlurred.colors[0]
		StaticFBOState.ssaoSampler = StaticFBOState.ssao.colors[0]
		StaticFBOState.ssgiSampler = StaticFBOState.ssgi.colors[0]
		StaticFBOState.ssgiFallbackSampler = StaticFBOState.ssgiFallback.colors[0]
		StaticFBOState.sceneDepthVelocity = StaticFBOState.visibility.colors[0]
		StaticFBOState.entityIDSampler = StaticFBOState.visibility.colors[1]
		StaticFBOState.postProcessing1Sampler = StaticFBOState.postProcessing1.colors[0]
		StaticFBOState.postProcessing2Sampler = StaticFBOState.postProcessing2.colors[0]
		StaticFBOState.lensSampler = StaticFBOState.lens.colors[0]

		StaticFBOState.updateDirectionalShadowsFBO()
	}

	static updateDirectionalShadowsFBO() {
		const context = GPUState.context
		if (StaticFBOState.shadows)
			context.deleteTexture(StaticFBOState.shadows.depthSampler)
		StaticFBOState.shadows = new Framebuffer(EngineState.shadowMapResolution, EngineState.shadowMapResolution).depthTexture()
		StaticFBOState.shadowsSampler = StaticFBOState.shadows.depthSampler
	}

	static async generateSSAONoise() {
		const context = GPUState.context
		const {kernels, noise} = await ImageProcessor.request(
			ImageWorkerActions.NOISE_DATA,
			{w: RESOLUTION, h: RESOLUTION}
		)

		StaticUBOState.ssaoUBO.bind()
		StaticUBOState.ssaoUBO.updateData("samples", kernels)
		StaticUBOState.ssaoUBO.unbind()
		StaticFBOState.noiseSampler = context.createTexture()

		context.bindTexture(context.TEXTURE_2D, StaticFBOState.noiseSampler)
		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST)
		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST)
		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.REPEAT)
		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.REPEAT)
		context.texStorage2D(context.TEXTURE_2D, 1, context.RG16F, RESOLUTION, RESOLUTION)
		context.texSubImage2D(context.TEXTURE_2D, 0, 0, 0, RESOLUTION, RESOLUTION, context.RG, context.FLOAT, noise)

	}
}
