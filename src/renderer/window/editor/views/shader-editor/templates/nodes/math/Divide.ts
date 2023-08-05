import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Divide extends ShaderNode implements Signature{
	static signature = "Divide"
	getSignature():string{
		return Divide.signature
	}

	constructor() {
		super([
			{label: "A", key: "a", accept: [MaterialDataTypes.FLOAT, MaterialDataTypes.INT, MaterialDataTypes.VEC4, MaterialDataTypes.VEC3, MaterialDataTypes.VEC2 ]},
			{label: "B", key: "b", accept: [MaterialDataTypes.FLOAT, MaterialDataTypes.INT, MaterialDataTypes.VEC4, MaterialDataTypes.VEC3, MaterialDataTypes.VEC2 ] }
		], [
			{label: "Result", key: "divideRes", type: MaterialDataTypes.UNDEFINED}
		])
		this.name = "Divide"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a,b}, index) {
		this.divideRes = "divideRes" + index
		if(b && a)
			return `${a.type} ${this.divideRes} = ${a.name} / ${b.name};`
		else
			return `${a.type} ${this.divideRes};`
	}

}
