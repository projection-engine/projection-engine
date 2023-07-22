import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Multiply extends ShaderNode implements Signature{
	static signature = "Multiply"
	getSignature():string{
		return Multiply.signature
	}
	a = 0
	b = 0

	constructor() {
		super([
			{
				label: "A",
				key: "a",
				accept: [DATA_TYPES.FLOAT, DATA_TYPES.INT, DATA_TYPES.VEC4, DATA_TYPES.VEC3, DATA_TYPES.VEC2]
			},
			{
				label: "B",
				key: "b",
				accept: [DATA_TYPES.FLOAT, DATA_TYPES.INT, DATA_TYPES.VEC4, DATA_TYPES.VEC3, DATA_TYPES.VEC2]
			}
		], [
			{label: "Result", key: "multRes", type: DATA_TYPES.UNDEFINED}
		])
		this.name = "Multiply"
        
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a = {name: this.a, type: DATA_TYPES.FLOAT}, b = {name: this.b, type: DATA_TYPES.FLOAT}}, index) {
		this.multRes = "multRes" + index
		if (b && a)
			return `${a.type} ${this.multRes} = ${a.name} * ${b.name};`
		else
			return `${a.type} ${this.multRes};`
	}

}