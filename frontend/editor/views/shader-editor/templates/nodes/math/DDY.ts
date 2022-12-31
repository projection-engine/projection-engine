import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine-core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"


export default class DDY extends ShaderNode {
    a = 0
    constructor() {
        super([
            {label: "Y", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "ddyRes", type: DATA_TYPES.FLOAT}
        ])
        this.name = "DDY"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a={name: this.a}}, index) {
        this.ddyRes = "ddyRes" + index

        if(a)
            return `float ${this.ddyRes} = dFdy(${a.name});`
        else
            return `float ${this.ddyRes} = 0.;`
    }
}