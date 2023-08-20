import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import {MaterialDataTypes} from "@engine-core/engine.enum";


export default class Add extends ShaderNode implements Signature{
	static signature = "Add"
	getSignature():string{
		return Add.signature
	}
	addRes
	constructor() {
		super([
			{label: "A", key: "a", accept: [MaterialDataTypes.FLOAT, MaterialDataTypes.INT, MaterialDataTypes.VEC4, MaterialDataTypes.VEC3, MaterialDataTypes.VEC2 ]},
			{label: "B", key: "b", accept: [MaterialDataTypes.FLOAT, MaterialDataTypes.INT, MaterialDataTypes.VEC4, MaterialDataTypes.VEC3, MaterialDataTypes.VEC2 ]}
		], [
			{label: "Result", key: "addRes", type: MaterialDataTypes.UNDEFINED}
		])
		this.name = "Add"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a,b}, index) {
		this.addRes = "addRes" + index
		if(b && a)
			return `${a.type} ${this.addRes} = ${a.name} + ${b.name};`
		else
			return `${a.type} ${this.addRes};`
	}

}
