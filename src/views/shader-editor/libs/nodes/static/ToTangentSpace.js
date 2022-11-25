import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../material-compiler/templates/NODE_TYPES"


export default class ToTangentSpace extends ShaderNode {

    constructor() {
        super([], [
            {label: "Matrix", key: "TBN", type: DATA_TYPES.MAT3}
        ])

        this.name = "ToTangentSpace"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.STATIC
    }

    getFunctionCall() {
        // TODO - GENERATE TBN IF NOT EXISTENT
        this.TBN = "TBN"
        return ""
    }
}