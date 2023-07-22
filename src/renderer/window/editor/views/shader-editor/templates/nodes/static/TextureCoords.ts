import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class TextureCoords extends ShaderNode implements Signature{
	static signature = "TextureCoords"
	getSignature():string{
		return TextureCoords.signature
	}
	texture = {}

	constructor() {
		super([], [
			{label: "Coordinates", key: "texCoords", type: DATA_TYPES.VEC2}
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