import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class ElapsedTime extends ShaderNode implements Signature{
	static signature = "ElapsedTime"
	getSignature():string{
		return ElapsedTime.signature
	}

	constructor() {
		super([], [
			{label: "Elapsed", key: "elapsedTime", type: MaterialDataTypes.FLOAT}
		])

		this.name = "ElapsedTime"

	}

	get type() {
		return NODE_TYPES.STATIC
	}

	getFunctionCall() {
		this.elapsedTime = "elapsedTime"
		return ""
	}
}
