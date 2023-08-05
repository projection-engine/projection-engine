import ShaderNode from "../ShaderNode"
import NODE_TYPES from "../../static/NODE_TYPES"
import Signature from "../Signature"
import {MaterialDataTypes,} from "@engine-core/engine.enum";

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
				accept: [MaterialDataTypes.TEXTURE]
			},
			{
				label: "Texture coords",
				key: "texCoords",
				accept: [MaterialDataTypes.VEC2]
			},
			{
				label: "Blur radius",
				key: "blurRadius",
				accept: [MaterialDataTypes.FLOAT]
			},
			{
				label: "Samples",
				key: "samples",
				accept: [MaterialDataTypes.FLOAT]
			},
			{
				label: "Use default texel",
				key: "useDefaultTexel",
				type: MaterialDataTypes.CHECKBOX
			}
		], [
			{label: "Blurred", key: "blurredResult", type: MaterialDataTypes.VEC3}
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
