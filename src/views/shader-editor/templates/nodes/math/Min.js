import Node from "../Node"
import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"


export default class Min extends Node {
    a = 0
    b = 0
    constructor() {
        super([
            {label: "A", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT},
            {label: "B", key: "b", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "minRes", type: DATA_TYPES.FLOAT}
        ])
        this.name = "Min"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a={name: this.a},b={name: this.b}}, index) {
        this.minRes = "minRes" + index
        if(b && a)
            return `float ${this.minRes} = min(${a.name}, ${b.name});`
        return `float ${this.minRes};`
    }

}