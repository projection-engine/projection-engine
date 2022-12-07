import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../material-compiler/templates/NODE_TYPES"


export default class Add extends ShaderNode {

    constructor() {
        super([
            {label: "A", key: "a", accept: [DATA_TYPES.FLOAT, DATA_TYPES.INT, DATA_TYPES.VEC4, DATA_TYPES.VEC3, DATA_TYPES.VEC2 ]},
            {label: "B", key: "b", accept: [DATA_TYPES.FLOAT, DATA_TYPES.INT, DATA_TYPES.VEC4, DATA_TYPES.VEC3, DATA_TYPES.VEC2 ]}
        ], [
            {label: "Result", key: "addRes", type: DATA_TYPES.UNDEFINED}
        ])
        this.equalTypeInputs = true
        this.name = "Add"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a,b}, index) {
        this.addRes = "addRes" + index
        if(b && a)
            return `${a.type} ${this.addRes} = ${a.name} + ${b.name};`
        else
            return `${a.type} ${this.addRes};`
    }

}