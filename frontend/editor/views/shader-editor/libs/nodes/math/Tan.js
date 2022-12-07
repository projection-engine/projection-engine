import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../material-compiler/templates/NODE_TYPES"


export default class Tan extends ShaderNode {
    a = 0
    constructor() {
        super([
            {label: "A", key: "a", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "tanRes", type: DATA_TYPES.FLOAT}
        ])
        this.name = "Tangent"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a={name: this.a}}, index) {
        this.tanRes = "tanRes" + index
        if(a)
            return `float ${this.tanRes} = tan(${a.name});`
        return `float ${this.tanRes} = 0.;`
    }
}