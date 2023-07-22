import ShaderNode from "../ShaderNode"
import DATA_TYPES from "../../../../../../engine/core/static/DATA_TYPES"
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
				type: DATA_TYPES.FLOAT,
				min: 0,
				max: 10,
				accept: [DATA_TYPES.FLOAT]
			},
			{
				label: "Layers",
				key: "layers",
				type: DATA_TYPES.INT,
				min: 1,
				max: 64,
				accept: [DATA_TYPES.FLOAT]
			},
			{
				label: "Height Map",
				key: "heightMap",
				accept: [DATA_TYPES.TEXTURE]
			}
		], [
			{label: "UVs", key: "UVs", type: DATA_TYPES.VEC2}
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
			type: DATA_TYPES.FLOAT
		},
		heightScale = {
			name: ShaderEditorUtil.checkGlslFloat(this.heightScale),
			type: DATA_TYPES.FLOAT
		},
	}, index) {
		this.UVs = "UVs" + index
		return `vec2 ${this.UVs} = parallaxOcclusionMapping(${heightMap.name},  ${Material.getDataBehaviour(heightScale) },  int(${Material.getDataBehaviour(layers)}) );`
	}
}