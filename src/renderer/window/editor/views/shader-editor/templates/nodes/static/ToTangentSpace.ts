import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class ToTangentSpace extends ShaderNode implements Signature{
	static signature = "ToTangentSpace"
	getSignature():string{
		return ToTangentSpace.signature
	}

	constructor() {
		super([], [
			{label: "Matrix", key: "TBN", type: DATA_TYPES.MAT3}
		])
		this.name = "ToTangentSpace"
	}

	get type() {
		return NODE_TYPES.STATIC
	}

	getFunctionCall() {
		this.TBN = "TBN"
		return "computeTBN();"
	}
}