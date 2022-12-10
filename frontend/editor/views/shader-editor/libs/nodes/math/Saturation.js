import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../material-compiler/templates/NODE_TYPES"


export default class Saturation extends ShaderNode {
    x = 0
    constructor() {
        super([
            {label: "RGB", key: "a", accept: [DATA_TYPES.VEC3]},
            {label: "Adjustment", key: "x", accept: [DATA_TYPES.FLOAT], type: DATA_TYPES.FLOAT}
        ], [
            {label: "Result", key: "saturationRes", type: DATA_TYPES.VEC3}
        ])
        this.name = "Saturation"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }


    getFunctionCall({a, x={name: this.x}}, index) {
        this.saturationRes = "saturationRes" + index
        if(a)
            return `vec3 ${this.saturationRes} = saturation( ${a.name},  ${x.name});`
        return `vec3 ${this.saturationRes} = vec3(0.);`
    }

}