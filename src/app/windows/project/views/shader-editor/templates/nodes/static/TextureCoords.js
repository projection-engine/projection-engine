import Node from "../Node"
import DATA_TYPES from "../../../../../../../../../public/engine/production/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class TextureCoords extends Node {
    texture = {}

    constructor() {
        super([], [
            {label: "Coordinates", key: "texCoord", type: DATA_TYPES.VEC2}
        ])

        this.name = "TextureCoords"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.STATIC
    }
    getFunctionCall() {
        this.texCoord = "texCoord"
        return ""
    }
}