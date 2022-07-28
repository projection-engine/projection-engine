import Node from "../Node"
import {DATA_TYPES} from "../../../../../engine/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class Refract extends Node {
    r = 0
    constructor() {
        super([
            {label: "Vector", key: "a", accept: [DATA_TYPES.VEC3]},
            {label: "Normal", key: "n", accept: [DATA_TYPES.VEC3]},
            {label: "Ratio", key: "r", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "refractRes", type: DATA_TYPES.VEC3}
        ])
        this.name = "Refract"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({n, a, r={name: this.r}}, index) {
        this.refractRes = "refractRes" + index

        if(a)
            return `vec3 ${this.refractRes} = refract(${a.name}, ${n.name}, ${r.name});`
        return `vec3 ${this.refractRes} = vec3(0.);`
    }
}