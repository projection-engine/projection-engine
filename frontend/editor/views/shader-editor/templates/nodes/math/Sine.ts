import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine-core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"


export default class Sine extends ShaderNode {
    a = 0
    constructor() {
        super([
            {label: "A", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "sineRes", type: DATA_TYPES.FLOAT}
        ])
        this.name = "Sine"
        
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a={name: this.a}}, index) {
        this.sineRes = "sineRes" + index

        if(a)
            return `float ${this.sineRes} = sin(${a.name});`
        return `float ${this.sineRes} = 0.;`
    }

}