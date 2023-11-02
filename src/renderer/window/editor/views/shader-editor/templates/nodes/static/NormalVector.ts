import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import {MaterialDataTypes} from "@engine-core/engine.enum";


export default class NormalVector extends ShaderNode implements Signature{
	static signature = "NormalVector"
	getSignature():string{
		return NormalVector.signature
	}

	constructor() {
		super([], [
			{label: "Normal", key: "normalVec", type: MaterialDataTypes.VEC3}
		])

		this.name = "NormalVector"

	}

	get type() {
		return NODE_TYPES.STATIC
	}

	getFunctionCall() {
		this.normalVec = "normalVec"
		return ""
	}
}
