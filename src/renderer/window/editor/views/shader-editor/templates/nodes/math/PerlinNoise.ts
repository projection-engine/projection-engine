import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import ShaderEditorUtil from "../../../../../util/ShaderEditorUtil";
import {MaterialDataTypes} from "@engine-core/engine.enum";


export default class PerlinNoise extends ShaderNode implements Signature{
	static signature = "PerlinNoise"
	getSignature():string{
		return PerlinNoise.signature
	}
	amplitude = 1
	frequency = 4
	unitValue = 1920
	persistence = 5
	samples = 25
	constructor() {
		super([
			{
				label: "Seed",
				key: "vec",
				accept: [MaterialDataTypes.VEC2, MaterialDataTypes.FLOAT],
				type: MaterialDataTypes.FLOAT
			},
			{
				label: "Amplitude",
				key: "amplitude",
				type: MaterialDataTypes.FLOAT
			},
			{
				label: "unitValue",
				key: "unitValue",
				type: MaterialDataTypes.FLOAT
			},
			{
				label: "Frequency",
				key: "frequency",
				type: MaterialDataTypes.FLOAT
			},
			{
				label: "Persistence",
				key: "persistence",
				type: MaterialDataTypes.FLOAT
			}, {
				label: "Samples",
				max: 50,
				min: 0,
				key: "samples",
				type: MaterialDataTypes.INT
			}
		], [
			{label: "Noise", key: "res", type: MaterialDataTypes.FLOAT}
		])
		this.name = "PerlinNoise"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}





	getFunctionCall({vec}, index) {
		const response = []
		if (!this.res && vec) {
			this.res = `res${index}`
			response.push(`float ${this.res} = pNoise(${vec.type === MaterialDataTypes.FLOAT ? `vec2(${vec.name}, ${vec.name})` : vec.name}, ${this.samples}, ${ShaderEditorUtil.checkGlslFloat(this.persistence)}, ${ShaderEditorUtil.checkGlslFloat(this.frequency)}, ${ShaderEditorUtil.checkGlslFloat(this.amplitude)}, ${ShaderEditorUtil.checkGlslFloat(this.unitValue)});`)
		}

		return response.join("\n")
	}

}
