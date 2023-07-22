import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class SceneColor extends ShaderNode implements Signature{
	static signature = "SceneColor"
	getSignature():string{
		return SceneColor.signature
	}
	constructor() {
		super(
			[],
			[{label: "Sampler", key: "previousFrame", type: DATA_TYPES.TEXTURE}]
		)

		this.name = "SceneColor"
	}

	get type() {
		return NODE_TYPES.STATIC
	}

	getFunctionCall() {
		this.previousFrame = "previousFrame"
		return ""
	}
}