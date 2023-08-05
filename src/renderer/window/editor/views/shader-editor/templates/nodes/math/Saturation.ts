import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class Saturation extends ShaderNode implements Signature{
	static signature = "Saturation"
	getSignature():string{
		return Saturation.signature
	}
	x = 0
	constructor() {
		super([
			{label: "RGB", key: "a", accept: [MaterialDataTypes.VEC3]},
			{label: "Adjustment", key: "x", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT}
		], [
			{label: "Result", key: "saturationRes", type: MaterialDataTypes.VEC3}
		])
		this.name = "Saturation"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}


	getFunctionCall({a, x={name: this.x}}, index) {
		this.saturationRes = "saturationRes" + index
		if(a)
			return `vec3 ${this.saturationRes} = saturation( ${a.name},  ${x.name});`
		return `vec3 ${this.saturationRes} = vec3(0.);`
	}

}
