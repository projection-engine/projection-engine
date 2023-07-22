import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import ShaderEditorUtil from "../../../../../util/ShaderEditorUtil";


export default class Vec4 extends ShaderNode implements Signature{
	static signature = "Vec4"
	getSignature():string{
		return Vec4.signature
	}
	v = [0, 0, 0, 0]
	uniform = false

	constructor() {
		super([
			{
				label: "Dynamic",
				key: "uniform",
				type: DATA_TYPES.CHECKBOX,
			},
			{label: "Vector", key: "v", type: DATA_TYPES.VEC4},
		], [
			{label: "Value", key: "VEC4_VAR", type: DATA_TYPES.VEC4},
		])

		this.name = "Vec4"
        
	}

	get type() {
		if (this.uniform)
			return NODE_TYPES.VARIABLE
		else
			return NODE_TYPES.STATIC
	}


	async getInputInstance(index, uniforms, uniformValues) {
		this.uniformName = this.id.replaceAll("-", "_") + `_${index}`
		if (this.uniform) {

			uniformValues.push({
				label: this.name,
				key: this.uniformName,
				type: DATA_TYPES.VEC4,
				data: this.v
			})
			uniforms.push({
				label: this.name,
				key: this.uniformName,
				type: DATA_TYPES.VEC4
			})

			return `uniform vec4 ${this.uniformName};`
		}
		return `const vec4 ${this.uniformName} = vec4(${ShaderEditorUtil.checkGlslFloat(this.v[0])}, ${ShaderEditorUtil.checkGlslFloat(this.v[1])}, ${ShaderEditorUtil.checkGlslFloat(this.v[2])}, ${ShaderEditorUtil.checkGlslFloat(this.v[3])});`

	}

	getFunctionCall(_, index) {
		this.VEC4_VAR = "VEC4_VAR" + index
		return ""
	}
}