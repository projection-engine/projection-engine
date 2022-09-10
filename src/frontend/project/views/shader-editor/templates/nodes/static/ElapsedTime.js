import Node from "../Node"
import DATA_TYPES from "../../../../../../../../public/engine/production/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class ElapsedTime extends Node {

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