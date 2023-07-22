import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Normalize extends ShaderNode implements Signature{
	static signature = "Normalize"
	getSignature():string{
		return Normalize.signature
	}
	constructor() {
		super([
			{label: "Vector", key: "a", accept: [DATA_TYPES.VEC2,DATA_TYPES.VEC3,DATA_TYPES.VEC4]}
		], [
			{label: "Result", key: "normalizeRes", type: DATA_TYPES.UNDEFINED}
		])
		this.equalTypeInputs = true
		this.name = "Normalize"
        
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a}, index) {
		this.normalizeRes = "normalizeRes" + index

		if(a)
			return `${a.type} ${this.normalizeRes} = normalize(${a.name});`
		else
			return ""
	}
}