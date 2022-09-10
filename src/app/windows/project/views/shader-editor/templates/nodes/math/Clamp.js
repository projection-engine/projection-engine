import Node from "../Node"
import DATA_TYPES from "../../../../../../../../../public/engine/production/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class Clamp extends Node {
    a = 0
    b = 0
    c = 0
    constructor() {
        super([
            {label: "in", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT},
            {label: "Min", key: "b", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT},
            {label: "Max", key: "c", accept: [DATA_TYPES.FLOAT] , type: DATA_TYPES.FLOAT},
        ], [
            {label: "Result", key: "clampRes", type: DATA_TYPES.FLOAT}
        ])
        this.name = "Clamp"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a={name: this.a},b={name: this.b}, c={name: this.c}}, index) {
        this.clampRes = "clampRes" + index
        if(b && a && c)
            return `float ${this.clampRes} = clamp(${a.name}, ${b.name}, ${c.name});`
        else
            return `float ${this.clampRes};`
    }

}