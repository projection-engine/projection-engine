import Node from "../Node"
import DATA_TYPES from "../../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../../../public/engine/editor/libs/material-compiler/templates/NODE_TYPES"


export default class ToTangentSpace extends Node {

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