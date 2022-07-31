import Node from "../Node"
import DATA_TYPES from "../../../../../libs/engine/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class NormalVector extends Node {
    texture = {}

    constructor() {
        super([], [
            {label: "Normal", key: "normalVec", type: DATA_TYPES.VEC3}
        ])

        this.name = "NormalVector"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.STATIC
    }

    getFunctionCall() {
        this.normalVec = "normalVec"
        return ""
    }
}