import ShaderNode from "../../ShaderNode"

import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import {MaterialDataTypes,} from "@engine-core/engine.enum";

export default class BreakVector extends ShaderNode implements Signature{
	static signature = "BreakVector"
	getSignature():string{
		return BreakVector.signature
	}
	xV = 0
	yV = 0
	zV = 0
	wV = 0

	constructor() {
		super([
			{label: "Vector", key: "v", accept: [MaterialDataTypes.VEC2, MaterialDataTypes.VEC3, MaterialDataTypes.VEC4]}
		], [
			{label: "X", key: "xV", type: MaterialDataTypes.FLOAT},
			{label: "Y", key: "yV", type: MaterialDataTypes.FLOAT},
			{label: "Z", key: "zV", type: MaterialDataTypes.FLOAT},
			{label: "W", key: "wV", type: MaterialDataTypes.FLOAT}
		])

		this.name = "BreakVector"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({v}, index, outputs) {
		const response = []

		outputs.forEach(o => {
			if (!this[o]) {
				this[o] = o + `${index}`

				if ((v.type === MaterialDataTypes.VEC2 || v.type === MaterialDataTypes.VEC3) && o === "wV")
					response.push(`float ${this[o]} = 0.;`)
				else if (v.type === MaterialDataTypes.VEC2 && o === "zV")
					response.push(`float ${this[o]} = 0.;`)
				else
					response.push(`float ${this[o]} = ${v.name}.${o.charAt(0)};`)
			}
		})
		return response.join("\n")
	}

}
