import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import {MaterialDataTypes} from "@engine-core/engine.enum";


export default class QuadUV extends ShaderNode implements Signature{
	static signature = "QuadUV"
	getSignature():string{
		return QuadUV.signature
	}
	constructor() {
		super([], [
			{label: "Coordinates", key: "quadUV", type: MaterialDataTypes.VEC2}
		])

		this.name = "QuadUV"
	}

	get type() {
		return NODE_TYPES.STATIC
	}
	getFunctionCall() {
		this.quadUV = "quadUV"
		return ""
	}
}
