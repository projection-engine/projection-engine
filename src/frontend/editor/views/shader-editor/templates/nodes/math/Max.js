import Node from "../Node"
import DATA_TYPES from "../../../../../../../../public/engine/production/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class Max extends Node {
    a = 0
    b = 0
    constructor() {
        super([
            {label: "A", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT},
            {label: "B", key: "b", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "maxRes", type: DATA_TYPES.FLOAT}
        ])
        this.name = "Max"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    async  getInputInstance() {
        return ""
    }

    getFunctionCall({a={name: this.a},b={name: this.b}}, index) {
        this.maxRes = "maxRes" + index
        if(b && a)
            return `float ${this.maxRes} = max(${a.name}, ${b.name});`
        return `float ${this.maxRes};`
    }

}