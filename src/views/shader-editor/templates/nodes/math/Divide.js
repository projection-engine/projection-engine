import Node from "../Node"
import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"


export default class Divide extends Node {

    constructor() {
        super([
            {label: "A", key: "a", accept: [DATA_TYPES.FLOAT, DATA_TYPES.INT, DATA_TYPES.VEC4, DATA_TYPES.VEC3, DATA_TYPES.VEC2 ]},
            {label: "B", key: "b", accept: [DATA_TYPES.FLOAT, DATA_TYPES.INT, DATA_TYPES.VEC4, DATA_TYPES.VEC3, DATA_TYPES.VEC2 ] }
        ], [
            {label: "Result", key: "divideRes", type: DATA_TYPES.UNDEFINED}
        ])
        this.name = "Divide"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a,b}, index) {
        this.divideRes = "divideRes" + index
        if(b && a)
            return `${a.type} ${this.divideRes} = ${a.name} / ${b.name};`
        else
            return `${a.type} ${this.divideRes};`
    }

}