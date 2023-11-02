import GPUState from "../states/GPUState"
import LightProbe from "@engine-core/lib/resources/LightProbe"


export default class CubeMapManager {
	static frameBuffer?:WebGLFramebuffer
	static #initialized = false

	static initialize() {
		if (CubeMapManager.#initialized)
			return
		CubeMapManager.#initialized = true
		GPUState.context.bindVertexArray(null)
		CubeMapManager.frameBuffer = GPUState.context.createFramebuffer()
	}

	static createRenderBuffer(resolution:number):WebGLRenderbuffer {
		GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, CubeMapManager.frameBuffer)
		const rbo = GPUState.context.createRenderbuffer()
		GPUState.context.bindRenderbuffer(GPUState.context.RENDERBUFFER, rbo)
		GPUState.context.renderbufferStorage(GPUState.context.RENDERBUFFER, GPUState.context.DEPTH_COMPONENT24, resolution, resolution)
		GPUState.context.framebufferRenderbuffer(GPUState.context.FRAMEBUFFER, GPUState.context.DEPTH_ATTACHMENT, GPUState.context.RENDERBUFFER, rbo)
		return rbo
	}

	static initializeTexture(asDepth:boolean, resolution:number, mipmap?:boolean):WebGLTexture {
		const texture = GPUState.context.createTexture()
		GPUState.context.bindTexture(GPUState.context.TEXTURE_CUBE_MAP, texture)
		GPUState.context.texParameteri(GPUState.context.TEXTURE_CUBE_MAP, GPUState.context.TEXTURE_MAG_FILTER, asDepth ? GPUState.context.NEAREST : GPUState.context.LINEAR)
		GPUState.context.texParameteri(GPUState.context.TEXTURE_CUBE_MAP, GPUState.context.TEXTURE_MIN_FILTER, asDepth ? GPUState.context.NEAREST : (mipmap ? GPUState.context.LINEAR_MIPMAP_LINEAR : GPUState.context.LINEAR))

		GPUState.context.texParameteri(GPUState.context.TEXTURE_CUBE_MAP, GPUState.context.TEXTURE_WRAP_S, GPUState.context.CLAMP_TO_EDGE)
		GPUState.context.texParameteri(GPUState.context.TEXTURE_CUBE_MAP, GPUState.context.TEXTURE_WRAP_T, GPUState.context.CLAMP_TO_EDGE)
		GPUState.context.texParameteri(GPUState.context.TEXTURE_CUBE_MAP, GPUState.context.TEXTURE_WRAP_R, GPUState.context.CLAMP_TO_EDGE)
		const d = [
			{access: GPUState.context.TEXTURE_CUBE_MAP_POSITIVE_X},
			{access: GPUState.context.TEXTURE_CUBE_MAP_NEGATIVE_X},
			{access: GPUState.context.TEXTURE_CUBE_MAP_POSITIVE_Y},
			{access: GPUState.context.TEXTURE_CUBE_MAP_NEGATIVE_Y},
			{access: GPUState.context.TEXTURE_CUBE_MAP_POSITIVE_Z},
			{access: GPUState.context.TEXTURE_CUBE_MAP_NEGATIVE_Z}
		]
		for (let i = 0; i < 6; i++) {
			GPUState.context.texImage2D(
				d[i].access,
				0,
				asDepth ? GPUState.context.DEPTH_COMPONENT32F : GPUState.context.RGBA16F,
				resolution,
				resolution,
				0,
				asDepth ? GPUState.context.DEPTH_COMPONENT : GPUState.context.RGBA,
				GPUState.context.FLOAT,
				null)
		}

		if (mipmap)
			GPUState.context.generateMipmap(GPUState.context.TEXTURE_CUBE_MAP)
		return texture
	}

	static delete(probe:LightProbe) {
		if (probe.texture)
			GPUState.context.deleteTexture(probe.texture)
		if (probe.irradianceTexture)
			GPUState.context.deleteTexture(probe.irradianceTexture)
		if (probe.prefiltered)
			GPUState.context.deleteTexture(probe.prefiltered)
	}
}

