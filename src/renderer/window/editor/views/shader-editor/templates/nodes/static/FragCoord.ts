import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import {MaterialDataTypes} from "@engine-core/engine.enum";


export default class FragCoord extends ShaderNode implements Signature{
	static signature = "FragCoord"
	getSignature():string{
		return FragCoord.signature
	}
	constructor() {
		super([], [
			{label: "Coordinates", key: "fragCoord", type: MaterialDataTypes.VEC4}
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
