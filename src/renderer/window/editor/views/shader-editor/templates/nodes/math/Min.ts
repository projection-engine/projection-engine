import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Min extends ShaderNode implements Signature{
	static signature = "Min"
	getSignature():string{
		return Min.signature
	}
	a = 0
	b = 0
	constructor() {
		super([
			{label: "A", key: "a", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT},
			{label: "B", key: "b", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT}
		], [
			{label: "Result", key: "minRes", type: MaterialDataTypes.FLOAT}
		])
		this.name = "Min"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a={name: this.a},b={name: this.b}}, index) {
		this.minRes = "minRes" + index
		if(b && a)
			return `float ${this.minRes} = min(${a.name}, ${b.name});`
		return `float ${this.minRes};`
	}

}
