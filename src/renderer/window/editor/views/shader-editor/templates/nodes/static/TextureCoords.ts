import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import {MaterialDataTypes} from "@engine-core/engine.enum";


export default class TextureCoords extends ShaderNode implements Signature{
	static signature = "TextureCoords"
	getSignature():string{
		return TextureCoords.signature
	}
	texture = {}

	constructor() {
		super([], [
			{label: "Coordinates", key: "texCoords", type: MaterialDataTypes.VEC2}
		])

		this.name = "TextureCoords"

	}

	get type() {
		return NODE_TYPES.STATIC
	}
	getFunctionCall() {
		this.texCoords = "texCoords"
		return ""
	}
}
