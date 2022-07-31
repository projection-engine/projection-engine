import Node from "../Node"
import {DATA_TYPES} from "../../../../../libs/engine/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class Saturation extends Node {
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

    getFunctionInstance() {
        return `
            vec3 saturation(vec3 rgb, float adjustment)
            { 
                vec3 intensity = vec3(dot(rgb, vec3(0.2125, 0.7154, 0.0721)));
                return mix(intensity, rgb, adjustment);
            }
        `
    }

    getFunctionCall({a, x={name: this.x}}, index) {
        this.saturationRes = "saturationRes" + index
        if(a)
            return `vec3 ${this.saturationRes} = saturation( ${a.name},  ${x.name});`
        return `vec3 ${this.saturationRes} = vec3(0.);`
    }

}