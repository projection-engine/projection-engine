import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"


export default class ViewDirection extends ShaderNode implements Signature{
	static signature = "ViewDirection"
	getSignature():string{
		return ViewDirection.signature
	}

	constructor() {
		super([], [
			{label: "Coordinates", key: "viewDirection", type: MaterialDataTypes.VEC3},
			{label: "X", key: "r", type: MaterialDataTypes.FLOAT, color: "red"},
			{label: "Y", key: "g", type: MaterialDataTypes.FLOAT, color: "green"},
			{label: "Z", key: "b", type: MaterialDataTypes.FLOAT, color: "blue"}
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
