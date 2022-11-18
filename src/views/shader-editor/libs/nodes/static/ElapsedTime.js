import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"


export default class ElapsedTime extends ShaderNode {

    constructor() {
        super([], [
            {label: "Elapsed", key: "elapsedTime", type: DATA_TYPES.FLOAT}
        ])

        this.name = "ElapsedTime"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.STATIC
    }
     
    getFunctionCall() {
        this.elapsedTime = "elapsedTime"
        return ""
    }
}