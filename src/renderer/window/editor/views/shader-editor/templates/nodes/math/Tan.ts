import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Tan extends ShaderNode implements Signature{
	static signature = "Tan"
	getSignature():string{
		return Tan.signature
	}
	a = 0
	constructor() {
		super([
			{label: "A", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
		], [
			{label: "Result", key: "tanRes", type: DATA_TYPES.FLOAT}
		])
		this.name = "Tangent"
        
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a={name: this.a}}, index) {
		this.tanRes = "tanRes" + index
		if(a)
			return `float ${this.tanRes} = tan(${a.name});`
		return `float ${this.tanRes} = 0.;`
	}
}