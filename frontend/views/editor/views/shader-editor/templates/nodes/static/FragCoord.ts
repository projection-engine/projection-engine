import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../../engine-core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"


export default class FragCoord extends ShaderNode {
    constructor() {
        super([], [
            {label: "Coordinates", key: "fragCoord", type: DATA_TYPES.VEC4}
        ])

        this.name = "FragCoord"
    }

    get type() {
        return NODE_TYPES.STATIC
    }
    getFunctionCall() {
        this.fragCoord = "gl_FragCoord"
        return ""
    }
}