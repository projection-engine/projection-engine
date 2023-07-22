import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Cosine extends ShaderNode implements Signature{
	static signature = "Cosine"
	getSignature():string{
		return Cosine.signature
	}
	a = 0
	constructor() {
		super([
			{label: "A", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
		], [
			{label: "Result", key: "cosRes", type: DATA_TYPES.FLOAT}
		])
		this.name = "Cosine"
        
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a={name: this.a}}, index) {
		this.cosRes = "cosRes" + index

		if(a)
			return `float ${this.cosRes} = cos(${a.name});`
		else
			return `float ${this.cosRes} = 0.;`
	}
}