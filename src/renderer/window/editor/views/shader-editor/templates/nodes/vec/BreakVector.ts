import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"

import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


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
			{label: "Vector", key: "v", accept: [DATA_TYPES.VEC2, DATA_TYPES.VEC3, DATA_TYPES.VEC4]}
		], [
			{label: "X", key: "xV", type: DATA_TYPES.FLOAT},
			{label: "Y", key: "yV", type: DATA_TYPES.FLOAT},
			{label: "Z", key: "zV", type: DATA_TYPES.FLOAT},
			{label: "W", key: "wV", type: DATA_TYPES.FLOAT}
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

				if ((v.type === DATA_TYPES.VEC2 || v.type === DATA_TYPES.VEC3) && o === "wV")
					response.push(`float ${this[o]} = 0.;`)
				else if (v.type === DATA_TYPES.VEC2 && o === "zV")
					response.push(`float ${this[o]} = 0.;`)
				else
					response.push(`float ${this[o]} = ${v.name}.${o.charAt(0)};`)
			}
		})
		return response.join("\n")
	}

}