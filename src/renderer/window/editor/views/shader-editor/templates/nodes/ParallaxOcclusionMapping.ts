import ShaderNode from "../ShaderNode"
import NODE_TYPES from "../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../Signature"
import Material from "./Material"
import ShaderEditorUtil from "../../../../util/ShaderEditorUtil"


export default class ParallaxOcclusionMapping extends ShaderNode implements Signature{
	static signature = "ParallaxOcclusionMapping"
	getSignature():string{
		return ParallaxOcclusionMapping.signature
	}
	heightScale = 1.
	layers = 32

	constructor() {
		super([
			{
				label: "Height scale",
				key: "heightScale",
				type: MaterialDataTypes.FLOAT,
				min: 0,
				max: 10,
				accept: [MaterialDataTypes.FLOAT]
			},
			{
				label: "Layers",
				key: "layers",
				type: MaterialDataTypes.INT,
				min: 1,
				max: 64,
				accept: [MaterialDataTypes.FLOAT]
			},
			{
				label: "Height Map",
				key: "heightMap",
				accept: [MaterialDataTypes.TEXTURE]
			}
		], [
			{label: "UVs", key: "UVs", type: MaterialDataTypes.VEC2}
		])
		this.name = "ParallaxOcclusionMapping"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({
		heightMap,
		layers = {
			name: ShaderEditorUtil.checkGlslFloat(this.layers),
			type: MaterialDataTypes.FLOAT
		},
		heightScale = {
			name: ShaderEditorUtil.checkGlslFloat(this.heightScale),
			type: MaterialDataTypes.FLOAT
		},
	}, index) {
		this.UVs = "UVs" + index
		return `vec2 ${this.UVs} = parallaxOcclusionMapping(${heightMap.name},  ${Material.getDataBehaviour(heightScale) },  int(${Material.getDataBehaviour(layers)}) );`
	}
}
