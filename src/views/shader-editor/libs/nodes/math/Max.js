import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"


export default class Max extends ShaderNode {
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


    getFunctionCall({a={name: this.a},b={name: this.b}}, index) {
        this.maxRes = "maxRes" + index
        if(b && a)
            return `float ${this.maxRes} = max(${a.name}, ${b.name});`
        return `float ${this.maxRes};`
    }

}