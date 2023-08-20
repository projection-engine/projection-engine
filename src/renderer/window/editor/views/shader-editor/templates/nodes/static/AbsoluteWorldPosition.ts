import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import {MaterialDataTypes} from "@engine-core/engine.enum";


export default class AbsoluteWorldPosition extends ShaderNode implements Signature{
	static signature = "AbsoluteWorldPosition"
	getSignature():string{
		return AbsoluteWorldPosition.signature
	}

	constructor() {
		super([], [
			{label: "Coordinates", key: "worldSpacePosition", type: MaterialDataTypes.VEC3}
		])

		this.name = "AbsoluteWorldPosition"

	}

	get type() {

		return NODE_TYPES.STATIC
	}
	getFunctionCall( ) {
		this.worldSpacePosition = "worldSpacePosition"
		return ""
	}
}
