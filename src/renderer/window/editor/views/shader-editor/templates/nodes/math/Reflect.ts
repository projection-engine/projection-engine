import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Reflect extends ShaderNode implements Signature{
	static signature = "Reflect"
	getSignature():string{
		return Reflect.signature
	}
	constructor() {
		super([
			{label: "Vector", key: "a", accept: [MaterialDataTypes.VEC3]},
			{label: "Normal", key: "n", accept: [MaterialDataTypes.VEC3]}
		], [
			{label: "Result", key: "reflectRes", type: MaterialDataTypes.VEC3}
		])
		this.name = "Reflect"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({n, a}, index) {
		this.reflectRes = "reflectRes" + index

		if(a)
			return `vec3 ${this.reflectRes} = reflect(${a.name}, ${n.name});`
		return `vec3 ${this.reflectRes} = vec3(0.);`
	}
}
