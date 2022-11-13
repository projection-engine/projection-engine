import Node from "../Node"
import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"


export default class Multiply extends Node {
    a = 0
    b = 0
    constructor() {
        super([
            {label: "A", key: "a", accept: [DATA_TYPES.FLOAT, DATA_TYPES.INT, DATA_TYPES.VEC4, DATA_TYPES.VEC3, DATA_TYPES.VEC2 ]},
            {label: "B", key: "b", accept: [DATA_TYPES.FLOAT, DATA_TYPES.INT, DATA_TYPES.VEC4, DATA_TYPES.VEC3, DATA_TYPES.VEC2 ] }
        ], [
            {label: "Result", key: "multRes", type: DATA_TYPES.UNDEFINED}
        ])
        this.name = "Multiply"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }
    getFunctionCall({a={name: this.a},b={name: this.b}}, index) {
        this.multRes = "multRes" + index
        if(b && a)
            return `${a.type} ${this.multRes} = ${a.name} * ${b.name};`
        else
            return `${a.type} ${this.multRes};`
    }

}