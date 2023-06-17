import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../static/DATA_TYPES"
import NODE_TYPES from "../../../static/NODE_TYPES"
import Signature from "../../Signature"

export default class Fresnel extends ShaderNode implements Signature{
	static signature = "Fresnel"
	getSignature():string{
		return Fresnel.signature
	}
	constructor() {
		super([
			{
				label: "F0",
				key: "F0",
				accept: [DATA_TYPES.VEC3]
			},
			{
				label: "Cosine Theta",
				key: "cosTheta",
				accept: [DATA_TYPES.FLOAT]
			}
		], [
			{label: "Value", key: "valueFresnel", type: DATA_TYPES.VEC3}
		])
		this.name = "Fresnel"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({F0, cosTheta}, index) {
		this.valueFresnel = "valueFresnel" + index
		if (F0?.name !== undefined && cosTheta?.name !== undefined)
			return `vec2 ${this.valueFresnel} = fresnelSchlick( ${cosTheta.name},  ${F0.name} );`
		return `vec2 ${this.valueFresnel} = vec3(0.);`
	}
}