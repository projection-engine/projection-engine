import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../../engine-core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"


export default class TextureCoords extends ShaderNode {
    constructor() {
        super(
            [],
            [{label: "Sampler", key: "previousFrame", type: DATA_TYPES.TEXTURE}]
        )

        this.name = "TextureCoords"
    }

    get type() {
        return NODE_TYPES.STATIC
    }

    getFunctionCall() {
        this.previousFrame = "previousFrame"
        return ""
    }
}