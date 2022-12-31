import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine-core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"


export default class TextureCoords extends ShaderNode {
    texture = {}

    constructor() {
        super([], [
            {label: "Coordinates", key: "texCoords", type: DATA_TYPES.VEC2}
        ])

        this.name = "TextureCoords"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.STATIC
    }
    getFunctionCall() {
        this.texCoords = "texCoords"
        return ""
    }
}