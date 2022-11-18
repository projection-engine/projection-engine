import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"


export default class ToTangentSpace extends ShaderNode {

    constructor() {
        super([], [
            {label: "Matrix", key: "toTangentSpace", type: DATA_TYPES.MAT3}
        ])

        this.name = "ToTangentSpace"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.STATIC
    }

    getFunctionCall() {
        this.toTangentSpace = "toTangentSpace"
        return ""
    }
}