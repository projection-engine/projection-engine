import Node from "../Node"
import DATA_TYPES from "../../../../../../../../public/engine/production/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class SineH extends Node {
    a = 0
    constructor() {
        super([
            {label: "A", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "sineHRes", type: DATA_TYPES.FLOAT}
        ])
        this.name = "SineH"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a={name: this.a}}, index) {
        this.sineHRes = "sineHRes" + index
        if(a)
            return `float ${this.sineHRes} = sinh(${a.name});`
        return `float ${this.sineHRes} = 0.;`
    }
}