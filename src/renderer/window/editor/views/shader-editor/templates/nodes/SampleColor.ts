import ShaderNode from "../ShaderNode"
import NODE_TYPES from "../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../Signature"

import {MaterialDataTypes,} from "@engine-core/engine.enum";

export default class SampleColor extends ShaderNode implements Signature{
	static signature = "SampleColor"
	getSignature():string{
		return SampleColor.signature
	}
	constructor() {
		super(
			[
				{label: "UV", key: "uv", accept: [MaterialDataTypes.VEC2]},
				{label: "Sampler", key: "texture", accept: [MaterialDataTypes.TEXTURE]}
			],
			[
				{label: "RGB", key: "rgb", type: MaterialDataTypes.VEC3, disabled: true},
				{label: "R", key: "r", type: MaterialDataTypes.FLOAT, color: "red", disabled: true},
				{label: "G", key: "g", type: MaterialDataTypes.FLOAT, color: "green", disabled: true},
				{label: "B", key: "b", type: MaterialDataTypes.FLOAT, color: "blue", disabled: true},
				{label: "Alpha", key: "a", type: MaterialDataTypes.FLOAT, color: "white", disabled: true}
			]
		)
		this.name = "SampleColor"
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({uv, texture}, index: number, outputs) {
		const samplerName = this.name + "_" + index + "_S"
		const response = [
			`vec4 ${samplerName} =${texture ? `texture(${texture.name}, ${uv !== undefined ? uv.name : "texCoords"})` : "vec4(0.)"};`
		]
		outputs.forEach(o => {
			if (!this[o]) {
				this[o] = o + `${index}`
				const outputKey = this.output.find(oo => oo.key === o)
				response.push(`${outputKey.type} ${this[o]} = ${samplerName}.${o};`)
			}
		})

		return response.join("\n")
	}
}
