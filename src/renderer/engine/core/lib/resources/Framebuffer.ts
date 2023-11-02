import GPUState from "../../states/GPUState"
import Texture from "./Texture"

export default class Framebuffer implements IResource{
	private readonly fallback: FBOTexture

	readonly width: number
	readonly height: number
	readonly FBO: WebGLFramebuffer
	RBO: WebGLRenderbuffer
	depthSampler: WebGLTexture
	readonly colors: WebGLTexture[] = []
	readonly attachments: number[] = []
	readonly colorsMetadata: FBOTexture[] = []
	resolution = new Float32Array(2)

	constructor(width = GPUState.internalResolution.w, height = GPUState.internalResolution.h) {

		this.width = width
		this.height = height
		this.resolution[0] = width
		this.resolution[1] = height
		this.FBO = GPUState.context.createFramebuffer()

		this.fallback = {
			w: this.width,
			h: this.height,
			attachment: 0,
			precision: GPUState.context.RGBA16F,
			format: GPUState.context.RGBA,
			type: GPUState.context.FLOAT,
			linear: false,
			repeat: false
		}
	}


	startMapping(noClearing?: boolean) {
		if (GPUState.activeFramebuffer === this)
			return
		this.use()
		GPUState.context.viewport(0, 0, this.width, this.height)
		if (!noClearing)
			GPUState.context.clear(GPUState.context.COLOR_BUFFER_BIT | GPUState.context.DEPTH_BUFFER_BIT)
	}


	stopMapping() {
		if (GPUState.activeFramebuffer !== this)
			return

		const context = GPUState.context
		GPUState.activeFramebuffer = undefined
		context.bindFramebuffer(context.FRAMEBUFFER, null)
	}

	depthTexture(): Framebuffer {
		this.use()
		this.depthSampler = Texture.createTexture(
			this.width,
			this.height,
			GPUState.context.DEPTH_COMPONENT24,
			0,
			GPUState.context.DEPTH_COMPONENT,
			GPUState.context.UNSIGNED_INT,
			null,
			GPUState.context.NEAREST,
			GPUState.context.NEAREST,
			GPUState.context.CLAMP_TO_EDGE,
			GPUState.context.CLAMP_TO_EDGE,
			true
		)

		GPUState.context.framebufferTexture2D(
			GPUState.context.FRAMEBUFFER,
			GPUState.context.DEPTH_ATTACHMENT,
			GPUState.context.TEXTURE_2D,
			this.depthSampler,
			0
		)
		return this
	}

	depthTest(): Framebuffer {
		this.use()
		this.RBO = GPUState.context.createRenderbuffer()
		GPUState.context.bindRenderbuffer(GPUState.context.RENDERBUFFER, this.RBO)
		GPUState.context.renderbufferStorage(GPUState.context.RENDERBUFFER, GPUState.context.DEPTH_COMPONENT24, this.width, this.height)
		GPUState.context.framebufferRenderbuffer(GPUState.context.FRAMEBUFFER, GPUState.context.DEPTH_ATTACHMENT, GPUState.context.RENDERBUFFER, this.RBO)

		return this
	}

	texture(obj?: FBOTexture): Framebuffer {
		const w = obj?.w || this.fallback.w
		const h = obj?.h || this.fallback.h
		const attachment = obj?.attachment || this.fallback.attachment
		const precision = obj?.precision || this.fallback.precision
		const format = obj?.format || this.fallback.format
		const type = obj?.type || this.fallback.type
		const linear = obj?.linear || this.fallback.linear
		const repeat = obj?.repeat || this.fallback.repeat


		this.colorsMetadata.push({...this.fallback, ...obj})
		this.use()
		const texture = GPUState.context.createTexture()
		GPUState.context.bindTexture(GPUState.context.TEXTURE_2D, texture)
		GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_MAG_FILTER, linear ? GPUState.context.LINEAR : GPUState.context.NEAREST)
		GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_MIN_FILTER, linear ? GPUState.context.LINEAR : GPUState.context.NEAREST)
		GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_WRAP_S, repeat ? GPUState.context.REPEAT : GPUState.context.CLAMP_TO_EDGE)
		GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_WRAP_T, repeat ? GPUState.context.REPEAT : GPUState.context.CLAMP_TO_EDGE)

		GPUState.context.texImage2D(
			GPUState.context.TEXTURE_2D,
			0,
			precision,
			w,
			h,
			0,
			format,
			type,
			null)
		GPUState.context.framebufferTexture2D(GPUState.context.FRAMEBUFFER, GPUState.context.COLOR_ATTACHMENT0 + attachment, GPUState.context.TEXTURE_2D, texture, 0)

		this.colors.push(texture)
		this.attachments[attachment] = GPUState.context.COLOR_ATTACHMENT0 + attachment
		GPUState.context.drawBuffers(this.attachments)

		return this
	}

	use() {
		if (GPUState.activeFramebuffer === this)
			return
		GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, this.FBO)
		GPUState.activeFramebuffer = this
	}

	clear() {
		this.use()
		GPUState.context.clear(GPUState.context.COLOR_BUFFER_BIT | GPUState.context.DEPTH_BUFFER_BIT)
		GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, null)
	}

	stop() {
		GPUState.activeFramebuffer = undefined
		GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, null)
	}

	static toImage(fbo, w = 300, h = 300): string {
		const canvas = document.createElement("canvas")
		canvas.width = w
		canvas.height = h
		const context = canvas.getContext("2d")
		GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, fbo)
		const data = new Float32Array(w * h * 4)
		GPUState.context.readPixels(0, 0, w, h, GPUState.context.RGBA, GPUState.context.FLOAT, data)
		for (let i = 0; i < data.length; i += 4) {
			data[i] *= 255
			data[i + 1] *= 255
			data[i + 2] *= 255
			data[i + 3] = 255
		}

		const imageData = context.createImageData(w, h)
		imageData.data.set(data)
		context.putImageData(imageData, 0, 0)
		GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, null)
		return canvas.toDataURL()
	}
}
