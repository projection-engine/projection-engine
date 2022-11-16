import Node from "../Node"
import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"


export default class AbsoluteWorldPosition extends Node {

    constructor() {
        super([], [
            {label: "Coordinates", key: "worldSpacePosition", type: DATA_TYPES.VEC3}
        ])

        this.name = "AbsoluteWorldPosition"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.STATIC
    }
    getFunctionCall( ) {
        this.worldSpacePosition = "worldSpacePosition"
        return ""
    }
}