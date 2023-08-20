import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import {MaterialDataTypes} from "@engine-core/engine.enum";


export default class Refract extends ShaderNode implements Signature{
	static signature = "Refract"
	getSignature():string{
		return Refract.signature
	}
	r = 0
	constructor() {
		super([
			{label: "Vector", key: "a", accept: [MaterialDataTypes.VEC3]},
			{label: "Normal", key: "n", accept: [MaterialDataTypes.VEC3]},
			{label: "Ratio", key: "r", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT}
		], [
			{label: "Result", key: "refractRes", type: MaterialDataTypes.VEC3}
		])
		this.name = "Refract"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({n, a, r={name: this.r}}, index) {
		this.refractRes = "refractRes" + index

		if(a)
			return `vec3 ${this.refractRes} = refract(${a.name}, ${n.name}, ${r.name});`
		return `vec3 ${this.refractRes} = vec3(0.);`
	}
}
