import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class DDY extends ShaderNode implements Signature{
	static signature = "DDY"
	getSignature():string{
		return DDY.signature
	}
	a = 0
	constructor() {
		super([
			{label: "Y", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
		], [
			{label: "Result", key: "ddyRes", type: DATA_TYPES.FLOAT}
		])
		this.name = "DDY"
        
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a={name: this.a}}, index) {
		this.ddyRes = "ddyRes" + index

		if(a)
			return `float ${this.ddyRes} = dFdy(${a.name});`
		else
			return `float ${this.ddyRes} = 0.;`
	}
}