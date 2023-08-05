import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class CosineH extends ShaderNode implements Signature{
	static signature = "CosineH"
	getSignature():string{
		return CosineH.signature
	}
	a = 0
	constructor() {
		super([
			{label: "A", key: "a", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT}
		], [
			{label: "Result", key: "cosHRes", type: MaterialDataTypes.FLOAT}
		])
		this.equalTypeInputs = true
		this.name = "CosineH"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a={name: this.a}}, index) {
		this.cosHRes = "cosHRes" + index

		if(a)
			return `float ${this.cosHRes} = cosh(${a.name});`
		else
			return `float ${this.cosHRes} = 0.;`
	}

}
