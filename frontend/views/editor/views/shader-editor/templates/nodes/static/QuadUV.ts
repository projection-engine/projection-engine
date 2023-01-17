import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../../engine-core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"


export default class QuadUV extends ShaderNode {
    constructor() {
        super([], [
            {label: "Coordinates", key: "quadUV", type: DATA_TYPES.VEC2}
        ])

        this.name = "QuadUV"
    }

    get type() {
        return NODE_TYPES.STATIC
    }
    getFunctionCall() {
        this.quadUV = "quadUV"
        return ""
    }
}