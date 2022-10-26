import Node from "../Node"
import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../../public/engine/editor-environment/libs/material-compiler/templates/NODE_TYPES"


export default class LinearInterpolate extends Node {
    c = 0.
    constructor() {
        super([
            {label: "A", key: "a", accept: [DATA_TYPES.VEC2,DATA_TYPES.VEC3,DATA_TYPES.VEC4]},
            {label: "B", key: "b", accept: [DATA_TYPES.VEC2,DATA_TYPES.VEC3,DATA_TYPES.VEC4]},
            {label: "Percentage", key: "c", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT},
        ], [
            {
                label: "Result",
                key: "LINEAR_INTERPOLATION",
                type: DATA_TYPES.UNDEFINED
            }
        ])
        this.name = "LinearInterpolate"
        this.size = 1
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({a,b, c={name: this.c}}, index) {
        this.LINEAR_INTERPOLATION = "LINEAR_INTERPOLATION" + index
        const minType = Node.getMinimalType(a, b)
        if(b && a && c)
            return `${minType} ${this.LINEAR_INTERPOLATION} = mix(${minType}(${a.name}), ${minType}(${b.name}), ${c.name});`
        return `${minType} ${this.LINEAR_INTERPOLATION} = ${minType}(0.);`
    }
}