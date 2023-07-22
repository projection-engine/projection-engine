import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class CameraCoords extends ShaderNode implements Signature{
	static signature = "CameraCoords"
	getSignature():string{
		return CameraCoords.signature
	}

	constructor() {
		super([], [
			{label: "Coordinates", key: "cameraPosition", type: DATA_TYPES.VEC3}
		])

		this.name = "CameraCoords"
        
	}

	get type() {
		return NODE_TYPES.STATIC
	}
	getFunctionCall() {
		this.cameraPosition = "placement"
		return ""
	}
}