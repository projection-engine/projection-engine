import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Saturate extends ShaderNode implements Signature{
	static signature = "Saturate"
	getSignature():string{
		return Saturate.signature
	}
	a = 0
	constructor() {
		super([
			{label: "In", key: "a", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT}
		], [
			{label: "Result", key: "saturateRes", type: MaterialDataTypes.FLOAT}
		])
		this.name = "Saturate"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a={name: this.a}}, index) {
		this.saturateRes = "saturateRes" + index
		if(a)
			return `float ${this.saturateRes} = clamp(${a.name}, 0., 1.);`
		return `float ${this.saturateRes} = 0.;`
	}

}
