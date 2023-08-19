import TEXTURE_WRAPPING from "../../static/texture/TEXTURE_WRAPPING"
import TEXTURE_FILTERING from "../../static/texture/TEXTURE_FILTERING"
import TEXTURE_FORMATS from "../../static/texture/TEXTURE_FORMATS"
import ImageProcessor from "../math/ImageProcessor"
import GPUState from "../../states/GPUState"
import EngineState from "@engine-core/states/EngineState";
import {ImageWorkerActions} from "@engine-core/engine.enum";


export default class Texture implements ITexture{
	loaded = false
	#texture?: WebGLTexture
	attributes: TextureParams = {}
	#image?: ImageBitmap | HTMLImageElement
	readonly #id: string

	get id() {
		return this.#id
	}

	constructor(id: string) {
		this.#id = id
	}

	get texture(){
		this.lastUsed = EngineState.elapsed
		return this.#texture
	}

	async initialize(attributes: TextureParams) {
		this.loaded = false
		const img = attributes.img
		this.attributes = attributes
		if (typeof img === "string") {
			if (img.includes("data:image/")) {
				this.#image = <ImageBitmap | undefined>await ImageProcessor.request(ImageWorkerActions.IMAGE_BITMAP, {
					base64: img,
					compressionRatio: attributes.compressionRatio,
					resolutionScale: attributes.resolutionScale
				})
				this.attributes.height = this.#image.height
				this.attributes.width = this.#image.width
			} else {
				const i = new Image()
				i.src = img
				await i.decode()
				this.#image = i
				this.attributes.height = i.naturalHeight
				this.attributes.width = i.naturalWidth
			}
		} else {
			this.attributes.height = img.height
			this.attributes.width = img.width
			this.#image = img
		}

		const {
			wrapS = TEXTURE_WRAPPING.REPEAT,
			wrapT = TEXTURE_WRAPPING.REPEAT,
			minFilter = TEXTURE_FILTERING.MIN.LINEAR_MIPMAP_LINEAR,
			magFilter = TEXTURE_FILTERING.MAG.LINEAR,
			internalFormat = TEXTURE_FORMATS.SRGBA.internalFormat,
			format = TEXTURE_FORMATS.SRGBA.format,
			width,
			height,
			type = "UNSIGNED_BYTE"
		} = this.attributes
		this.#texture = GPUState.context.createTexture()
		GPUState.context.bindTexture(GPUState.context.TEXTURE_2D, this.#texture)
		GPUState.context.texImage2D(GPUState.context.TEXTURE_2D, 0, GPUState.context[internalFormat], width, height, 0, GPUState.context[format], GPUState.context[type], this.#image)
		GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_MIN_FILTER, GPUState.context[minFilter])
		GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_MAG_FILTER, GPUState.context[magFilter])
		GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_WRAP_S, GPUState.context[wrapS])
		GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_WRAP_T, GPUState.context[wrapT])
		if (minFilter === TEXTURE_FILTERING.MIN.LINEAR_MIPMAP_LINEAR) {
			const anisotropicEXT = GPUState.context.getExtension("EXT_texture_filter_anisotropic")
			const anisotropicAmountMin = 8
			const anisotropicAmount = Math.min(anisotropicAmountMin, GPUState.context.getParameter(anisotropicEXT.MAX_TEXTURE_MAX_ANISOTROPY_EXT))
			GPUState.context.texParameterf(GPUState.context.TEXTURE_2D, anisotropicEXT.TEXTURE_MAX_ANISOTROPY_EXT, anisotropicAmount)
			GPUState.context.generateMipmap(GPUState.context.TEXTURE_2D)
		}
		this.attributes = null
		GPUState.context.bindTexture(GPUState.context.TEXTURE_2D, null)
		if (this.#image instanceof ImageBitmap)
			this.#image.close()
		this.#image = null
		this.loaded = true
		this.lastUsed = EngineState.elapsed
	}

	update(attributes: TextureParams) {
		if (this.loaded)
			GPUState.context.deleteTexture(this.#texture)
		this.initialize(attributes).catch(console.error)
	}

	static createTexture(
		width: number,
		height: number,
		internalFormat: number,
		border: number,
		format: number,
		type: number,
		data: null | HTMLImageElement | ImageBitmap,
		minFilter: number,
		magFilter: number,
		wrapS: number,
		wrapT: number,
		yFlip: boolean,
		autoUnbind = true
	): WebGLTexture {
		const texture = GPUState.context.createTexture()

		GPUState.context.bindTexture(GPUState.context.TEXTURE_2D, texture)
		GPUState.context.texImage2D(GPUState.context.TEXTURE_2D, 0, internalFormat, width, height, border, format, type, data)
		GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_MAG_FILTER, magFilter)
		GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_MIN_FILTER, minFilter)

		if (wrapS !== undefined)
			GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_WRAP_S, wrapS)
		if (wrapT !== undefined)
			GPUState.context.texParameteri(GPUState.context.TEXTURE_2D, GPUState.context.TEXTURE_WRAP_T, wrapT)
		if (yFlip === true) GPUState.context.pixelStorei(GPUState.context.UNPACK_FLIP_Y_WEBGL, false)
		if (autoUnbind)
			GPUState.context.bindTexture(GPUState.context.TEXTURE_2D, null)

		return texture
	}

	lastUsed: number;

}
