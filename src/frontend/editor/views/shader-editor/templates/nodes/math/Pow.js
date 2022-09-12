import Node from "../Node"
import DATA_TYPES from "../../../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class Pow extends Node {
    a = 0
    b = 0
    constructor() {
        super([
            {label: "A", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT},
            {label: "Exp", key: "b", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "powRes", type: DATA_TYPES.FLOAT}
        ])
        this.name = "Pow"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a={name: this.a},b={name: this.b}}, index) {
        this.powRes = "powRes" + index
        if(b && a)
            return `float ${this.powRes} = pow(${a.name}, ${b.name});`
        else
            return `float ${this.powRes};`
    }

}