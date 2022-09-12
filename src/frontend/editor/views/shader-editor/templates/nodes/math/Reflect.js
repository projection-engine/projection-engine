import Node from "../Node"
import DATA_TYPES from "../../../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class Reflect extends Node {
    constructor() {
        super([
            {label: "Vector", key: "a", accept: [DATA_TYPES.VEC3]},
            {label: "Normal", key: "n", accept: [DATA_TYPES.VEC3]}
        ], [
            {label: "Result", key: "reflectRes", type: DATA_TYPES.VEC3}
        ])
        this.name = "Reflect"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({n, a}, index) {
        this.reflectRes = "reflectRes" + index

        if(a)
            return `vec3 ${this.reflectRes} = reflect(${a.name}, ${n.name});`
        return `vec3 ${this.reflectRes} = vec3(0.);`
    }
}