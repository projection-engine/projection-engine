import ShaderNode from "../../ShaderNode"
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
				accept: [MaterialDataTypes.FLOAT, MaterialDataTypes.INT, MaterialDataTypes.VEC4, MaterialDataTypes.VEC3, MaterialDataTypes.VEC2]
			},
			{
				label: "B",
				key: "b",
				accept: [MaterialDataTypes.FLOAT, MaterialDataTypes.INT, MaterialDataTypes.VEC4, MaterialDataTypes.VEC3, MaterialDataTypes.VEC2]
			}
		], [
			{label: "Result", key: "multRes", type: MaterialDataTypes.UNDEFINED}
		])
		this.name = "Multiply"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a = {name: this.a, type: MaterialDataTypes.FLOAT}, b = {name: this.b, type: MaterialDataTypes.FLOAT}}, index) {
		this.multRes = "multRes" + index
		if (b && a)
			return `${a.type} ${this.multRes} = ${a.name} * ${b.name};`
		else
			return `${a.type} ${this.multRes};`
	}

}
