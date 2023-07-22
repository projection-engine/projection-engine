import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
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
			{label: "A", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
		], [
			{label: "Result", key: "cosHRes", type: DATA_TYPES.FLOAT}
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