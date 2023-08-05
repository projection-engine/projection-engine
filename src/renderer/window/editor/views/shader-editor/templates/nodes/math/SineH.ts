import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class SineH extends ShaderNode implements Signature{
	static signature = "SineH"
	getSignature():string{
		return SineH.signature
	}
	a = 0
	constructor() {
		super([
			{label: "A", key: "a", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT}
		], [
			{label: "Result", key: "sineHRes", type: MaterialDataTypes.FLOAT}
		])
		this.name = "SineH"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a={name: this.a}}, index) {
		this.sineHRes = "sineHRes" + index
		if(a)
			return `float ${this.sineHRes} = sinh(${a.name});`
		return `float ${this.sineHRes} = 0.;`
	}
}
