import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Max extends ShaderNode implements Signature{
	static signature = "Max"
	getSignature():string{
		return Max.signature
	}
	a = 0
	b = 0
	constructor() {
		super([
			{label: "A", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT},
			{label: "B", key: "b", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
		], [
			{label: "Result", key: "maxRes", type: DATA_TYPES.FLOAT}
		])
		this.name = "Max"
        
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}


	getFunctionCall({a={name: this.a},b={name: this.b}}, index) {
		this.maxRes = "maxRes" + index
		if(b && a)
			return `float ${this.maxRes} = max(${a.name}, ${b.name});`
		return `float ${this.maxRes};`
	}

}