import Node from "../Node"
import DATA_TYPES from "../../../../../libs/engine/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class DDX extends Node {
    a = 0
    constructor() {
        super([
            {label: "X", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "ddxRes", type: DATA_TYPES.FLOAT}
        ])
        this.name = "DDX"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }


    getFunctionCall({a={name: this.a}}, index) {
        this.ddxRes = "ddxRes" + index

        if(a)
            return `float ${this.ddxRes} = dFdx(${a.name});`
        else
            return `float ${this.ddxRes} = 0.;`
    }
}