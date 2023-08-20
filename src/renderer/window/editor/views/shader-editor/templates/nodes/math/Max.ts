import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import {MaterialDataTypes} from "@engine-core/engine.enum";


export default class Max extends ShaderNode implements Signature{
	static signature = "Max"
	getSignature():string{
		return Max.signature
	}
	a = 0
	b = 0
	constructor() {
		super([
			{label: "A", key: "a", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT},
			{label: "B", key: "b", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT}
		], [
			{label: "Result", key: "maxRes", type: MaterialDataTypes.FLOAT}
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
