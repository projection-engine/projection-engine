import Node from "../Node"
import DATA_TYPES from "../../../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class Normalize extends Node {
    constructor() {
        super([
            {label: "Vector", key: "a", accept: [DATA_TYPES.VEC2,DATA_TYPES.VEC3,DATA_TYPES.VEC4]}
        ], [
            {label: "Result", key: "normalizeRes", type: DATA_TYPES.UNDEFINED}
        ])
        this.equalTypeInputs = true
        this.name = "Normalize"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a}, index) {
        this.normalizeRes = "normalizeRes" + index

        if(a)
            return `${a.type} ${this.normalizeRes} = normalize(${a.name});`
        else
            return ""
    }
}