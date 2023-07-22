import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class ViewDirection extends ShaderNode implements Signature{
	static signature = "ViewDirection"
	getSignature():string{
		return ViewDirection.signature
	}

	constructor() {
		super([], [
			{label: "Coordinates", key: "viewDirection", type: DATA_TYPES.VEC3},
			{label: "X", key: "r", type: DATA_TYPES.FLOAT, color: "red"},
			{label: "Y", key: "g", type: DATA_TYPES.FLOAT, color: "green"},
			{label: "Z", key: "b", type: DATA_TYPES.FLOAT, color: "blue"}
		])

		this.name = "ViewDirection"
        
	}

	get type() {
		return NODE_TYPES.STATIC
	}

	getFunctionCall(_, index, outputs) {
		const response = [`
            if(!hasViewDirectionComputed){
                computeTBN();
                viewDirection = normalize(transpose(TBN) * (cameraPosition  - worldSpacePosition.xyz));
                hasViewDirectionComputed = true;
            }
        `]

		outputs.forEach(o => {
			if(o === "viewDirection"){
				this.viewDirection = "viewDirection"
			}
			else if (!this[o]) {

				this[o] = o + `${index}`
				response.push(`float ${this[o]} = viewDirection.${o};`)
			}
		})

		return response.join("\n")
	}

}