import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import ShaderEditorUtil from "../../../../../util/ShaderEditorUtil";


export default class Float extends ShaderNode implements Signature{
	static signature = "Float"
	getSignature():string{
		return Float.signature
	}
	v = 0
	uniform = false

	constructor() {
		super([
			{
				label: "Dynamic",
				key: "uniform",
				type: MaterialDataTypes.CHECKBOX,
			},
			{label: "Value", key: "v", type: MaterialDataTypes.FLOAT},
		], [
			{label: "Value", key: "FLOAT_VAR", type: MaterialDataTypes.FLOAT},
		])

		this.name = "Float"

	}

	get type() {
		if (this.uniform)
			return NODE_TYPES.VARIABLE
		else
			return NODE_TYPES.STATIC
	}

	async getInputInstance(index, uniforms, uniformValues) {
		if (this.uniform) {
			uniformValues.push({
				label: this.name,
				key: this.uniformName,
				type: MaterialDataTypes.FLOAT,
				data: this.v
			})
			uniforms.push({
				label: this.name,
				key: this.uniformName,
				type: MaterialDataTypes.FLOAT
			})

			return `uniform float ${this.uniformName};`
		}
		return `const float ${this.uniformName}  = ${ShaderEditorUtil.checkGlslFloat(this.v)};`
	}

	getFunctionCall() {
		this.FLOAT_VAR = this.uniformName
		return ""
	}
}
