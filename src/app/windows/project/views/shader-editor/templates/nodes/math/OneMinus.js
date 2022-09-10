import Node from "../Node"
import DATA_TYPES from "../../../../../../../../../public/engine/production/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class OneMinus extends Node {
    a = 0
    constructor() {
        super([
            {label: "A", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "oneMinusRes", type: DATA_TYPES.FLOAT}
        ])
        this.name = "1-X"
        this.size = 1
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a={name: this.a}}, index) {
        this.oneMinusRes = "oneMinusRes" + index
        if( a)
            return `float ${this.oneMinusRes} = 1. - ${a.name};`
        else
            return `float ${this.oneMinusRes};`
    }

}