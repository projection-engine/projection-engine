import MaterialManager from "../../managers/MaterialManager"
import MATERIAL_RENDERING_TYPES from "../../static/MATERIAL_RENDERING_TYPES"
import {UUID} from "crypto";


export default class Material implements IResource {
	#id: UUID
	#uniformValues: MutableObject = {}
	#uniforms: MaterialUniform[] = []
	#functionDeclaration?: string
	#uniformsDeclaration?: string
	renderingMode = MATERIAL_RENDERING_TYPES.UNLIT
	texturesInUse: TextureInUse = {}
	ssrEnabled = false
	doubleSided = false
	bindID = -1
	signature?: string

	constructor(id?: string, signature?: string) {
		this.#id = id as UUID || crypto.randomUUID()
		this.signature = signature
	}

	get id(): string {
		return this.#id
	}

	get uniforms(): MaterialUniform[] {
		return this.#uniforms
	}

	get uniformValues(): MutableObject {
		return this.#uniformValues
	}

	get functionDeclaration(): string | undefined {
		return this.#functionDeclaration
	}

	get uniformsDeclaration(): string | undefined {
		return this.#uniformsDeclaration
	}

	updateMaterialDeclaration(functionDeclaration, uniforms) {
		this.#functionDeclaration = functionDeclaration
		this.#uniformsDeclaration = uniforms
	}

	async updateUniformGroup(uniforms: MaterialUniform[]) {
		if (!uniforms)
			return
		this.#uniforms = uniforms
		await MaterialManager.updateMaterialUniforms(this)
	}

	async updateUniformAttribute(key, data) {
		const ind = this.#uniforms.findIndex(d => d.key === key)
		if (ind === -1)
			return false
		try {
			if (this.#uniforms[ind]) {
				this.#uniforms[ind] = data
				await MaterialManager.updateMaterialUniforms(this)
				return true
			}
		} catch (err) {
			console.error(err)
		}
		return false
	}
}
