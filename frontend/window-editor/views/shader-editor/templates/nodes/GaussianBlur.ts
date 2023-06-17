import ShaderNode from "../ShaderNode"
import DATA_TYPES from "../../static/DATA_TYPES"
import NODE_TYPES from "../../static/NODE_TYPES"
import Signature from "../Signature"

export default class GaussianBlur extends ShaderNode implements Signature{
	static signature = "GaussianBlur"
	getSignature():string{
		return GaussianBlur.signature
	}
	useDefaultTexel = true

	constructor() {
		super([
			{
				label: "Sampler",
				key: "sampler",
				accept: [DATA_TYPES.TEXTURE]
			},
			{
				label: "Texture coords",
				key: "texCoords",
				accept: [DATA_TYPES.VEC2]
			},
			{
				label: "Blur radius",
				key: "blurRadius",
				accept: [DATA_TYPES.FLOAT]
			},
			{
				label: "Samples",
				key: "samples",
				accept: [DATA_TYPES.FLOAT]
			},
			{
				label: "Use default texel",
				key: "useDefaultTexel",
				type: DATA_TYPES.CHECKBOX
			}
		], [
			{label: "Blurred", key: "blurredResult", type: DATA_TYPES.VEC3}
		])
		this.name = "GaussianBlur"
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({sampler, texCoords, useDefaultTexel, blurRadius, samples}, index) {
		this.blurredResult = "blurredResult" + index
		if (sampler?.name !== undefined && texCoords?.name !== undefined)
			return `vec3 ${this.blurredResult} = gaussian( ${sampler.name}, ${texCoords.name}, ${blurRadius ? blurRadius?.name : "0."}, ${samples ? `int(${samples.name})` : "16"}, ${this.useDefaultTexel});`
		return `vec3 ${this.blurredResult} = vec3(0.);`
	}
}