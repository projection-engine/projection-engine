import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Swizzle extends ShaderNode implements Signature{
	static signature = "Swizzle"
	getSignature():string{
		return Swizzle.signature
	}
	x = 0
	y = 0
	z = 0
	w = 0

	typeVector = "vec2"
	combination = "xy"

	constructor() {
		super([
			{label: "Vector", key: "v", accept: [DATA_TYPES.VEC2]},
			{
				label: "Vector length",
				key: "typeVector",
				type: DATA_TYPES.OPTIONS,
				options: [
					{label: "vec2", data: "vec2"},
					{label: "vec3", data: "vec3"},
					{label: "vec4", data: "vec4"},
				]
			},
			{
				label: "Combination",
				key: "combination",
				type: DATA_TYPES.STRING,
				bundled: true
			},
		], [
			{label: "X", key: "x", type: DATA_TYPES.FLOAT, color: "red"},
			{label: "Y", key: "y", type: DATA_TYPES.FLOAT, color: "green"},
			{label: "Z", key: "z", type: DATA_TYPES.FLOAT, color: "blue", disabled: true},
			{label: "W", key: "w", type: DATA_TYPES.FLOAT, color: "white", disabled: true},
		])
		this.inputs.find(i => i.key === "typeVector").onChange = (v) => {
			this.output = [
				{label: "X", key: "x", type: DATA_TYPES.FLOAT, color: "red"},
				{label: "Y", key: "y", type: DATA_TYPES.FLOAT, color: "green"},
				{label: "Z", key: "z", type: DATA_TYPES.FLOAT, color: "blue", disabled: v === "vec2"},
				{label: "W", key: "w", type: DATA_TYPES.FLOAT, color: "white", disabled: v === "vec2" || v === "vec3"},
			]
		}
		this.name = "Swizzle"
        
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}


     

     

	getFunctionCall({v}, index, outputs) {
		const response = []
		outputs.forEach(o => {
			if (!this[o] && !this.inputs.find(i => i.key === o)?.disabled) {
				this[o] = o + `${index}`
				response.push(`float ${this[o]} = ${v.name}.${o};`)
			}
		})


		return response.join("\n")
	}

}