import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine-core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"


export default class DDX extends ShaderNode {
    a = 0
    constructor() {
        super([
            {label: "X", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "ddxRes", type: DATA_TYPES.FLOAT}
        ])
        this.name = "DDX"
        
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