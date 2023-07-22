import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class FragCoord extends ShaderNode implements Signature{
	static signature = "FragCoord"
	getSignature():string{
		return FragCoord.signature
	}
	constructor() {
		super([], [
			{label: "Coordinates", key: "fragCoord", type: DATA_TYPES.VEC4}
		])

		this.name = "FragCoord"
	}

	get type() {
		return NODE_TYPES.STATIC
	}
	getFunctionCall() {
		this.fragCoord = "gl_FragCoord"
		return ""
	}
}