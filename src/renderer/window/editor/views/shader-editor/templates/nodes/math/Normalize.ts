import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Normalize extends ShaderNode implements Signature{
	static signature = "Normalize"
	getSignature():string{
		return Normalize.signature
	}
	constructor() {
		super([
			{label: "Vector", key: "a", accept: [MaterialDataTypes.VEC2,MaterialDataTypes.VEC3,MaterialDataTypes.VEC4]}
		], [
			{label: "Result", key: "normalizeRes", type: MaterialDataTypes.UNDEFINED}
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
