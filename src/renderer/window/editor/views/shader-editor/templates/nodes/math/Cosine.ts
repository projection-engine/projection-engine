import ShaderNode from "../../ShaderNode"
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
			{label: "A", key: "a", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT}
		], [
			{label: "Result", key: "cosRes", type: MaterialDataTypes.FLOAT}
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
