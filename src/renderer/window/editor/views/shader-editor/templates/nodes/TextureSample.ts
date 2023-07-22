import ShaderNode from "../ShaderNode"
import DATA_TYPES from "../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../libs/material-compiler/templates/NODE_TYPES"
import EditorFSUtil from "../../../../util/EditorFSUtil"
import Signature from "../Signature"


export default class TextureSample extends ShaderNode implements Signature {
	static signature = "TextureSample"

	getSignature(): string {
		return TextureSample.signature
	}

	uniform = true
	_texture: MutableObject = {}

	get texture() {
		return this._texture
	}

	set texture(data) {
		this._texture = data
		this.output = this.output.map(o => {
			o.disabled = false
			return o
		})
	}


	constructor() {
		super(
			[
				{label: "UV", key: "uv", accept: [DATA_TYPES.VEC2]},
				{label: "Sampler", key: "texture", type: DATA_TYPES.TEXTURE}
			],
			[
				{label: "Sampler", key: "sampler", type: DATA_TYPES.TEXTURE, disabled: true},
				{label: "RGB", key: "rgb", type: DATA_TYPES.VEC3, disabled: true},
				{label: "R", key: "r", type: DATA_TYPES.FLOAT, color: "red", disabled: true},
				{label: "G", key: "g", type: DATA_TYPES.FLOAT, color: "green", disabled: true},
				{label: "B", key: "b", type: DATA_TYPES.FLOAT, color: "blue", disabled: true},
				{label: "Alpha", key: "a", type: DATA_TYPES.FLOAT, color: "white", disabled: true}
			]
		)
		this.inputs.find(i => i.key === "texture").onChange = (v) => {
			if (!v || Object.keys(v).length === 0)
				this.output = this.output.map(o => {
					o.disabled = true
					return o
				})
			else
				this.output = this.output.map(o => {
					o.disabled = false
					return o
				})
		}
		this.name = "TextureSample"
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}


	async getInputInstance(index, uniforms, uniformValues, textureOffset) {
		this.uniformName = "sampler" + textureOffset
		if (this.texture?.registryID) {
			try {
				const res = EditorFSUtil.getRegistryEntry(this.texture?.registryID)

				if (res) {
					uniforms.push({
						label: this.name,
						key: this.uniformName,
						type: DATA_TYPES.TEXTURE,
					})
					uniformValues.push({
						label: this.name,
						key: this.uniformName,
						data: res.id,
						type: DATA_TYPES.TEXTURE
					})
				}
			} catch (error) {
				console.error(error)
			}
		}
		return ""
	}

	getFunctionCall({uv}, index: number, outputs) {
		const samplerName = this.name + "_" + index + "_S"
		const response = []
		outputs.forEach(o => {
			if (o !== "sampler") {
				if (!this[o]) {
					this[o] = o + `${index}`
					if (response.length === 0)
						response.push(`vec4 ${samplerName} = texture(${this.uniformName}, ${uv !== undefined ? uv.name : "texCoords"});`)
					const outputKey = this.output.find(oo => oo.key === o)
					response.push(`${outputKey.type} ${this[o]} = ${samplerName}.${o};`)
				}
			} else
				this[o] = this.uniformName
		})

		return response.join("\n")
	}
}