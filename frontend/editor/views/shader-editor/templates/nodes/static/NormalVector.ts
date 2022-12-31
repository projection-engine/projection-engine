import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine-core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"


export default class NormalVector extends ShaderNode {
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