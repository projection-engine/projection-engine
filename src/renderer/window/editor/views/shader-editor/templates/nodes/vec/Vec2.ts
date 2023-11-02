import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import ShaderEditorUtil from "../../../../../util/ShaderEditorUtil";

import {MaterialDataTypes,} from "@engine-core/engine.enum";

export default class Vec2 extends ShaderNode implements Signature{
	static signature = "Vec2"
	getSignature():string{
		return Vec2.signature
	}
	v = [0, 0]
	uniform = false

	constructor() {
		super([
			{
				label: "Dynamic",
				key: "uniform",
				type: MaterialDataTypes.CHECKBOX,
			},
			{label: "Vector", key: "v", type: MaterialDataTypes.VEC2},
		], [
			{label: "Value", key: "VEC2_VAR", type: MaterialDataTypes.VEC2},
		])

		this.name = "Vec2"

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
				type: MaterialDataTypes.VEC2,
				data: this.v,
				internalKey: "v"
			})
			uniforms.push({
				label: this.name,
				key: this.uniformName,
				type: MaterialDataTypes.VEC2
			})

			return `uniform vec2 ${this.uniformName};`
		}
		return `const vec2 ${this.uniformName} = vec2(${ShaderEditorUtil.checkGlslFloat(this.v[0])}, ${ShaderEditorUtil.checkGlslFloat(this.v[1])});`

	}

	getFunctionCall() {
		this.VEC2_VAR = this.uniformName
		return ""
	}
}
