import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class OneMinus extends ShaderNode implements Signature{
	static signature = "OneMinus"
	getSignature():string{
		return OneMinus.signature
	}
	a = 0
	constructor() {
		super([
			{label: "A", key: "a", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT}
		], [
			{label: "Result", key: "oneMinusRes", type: MaterialDataTypes.FLOAT}
		])
		this.name = "1-X"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a={name: this.a}}, index) {
		this.oneMinusRes = "oneMinusRes" + index
		if( a)
			return `float ${this.oneMinusRes} = 1. - ${a.name};`
		else
			return `float ${this.oneMinusRes};`
	}

}
