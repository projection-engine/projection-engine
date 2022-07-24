import Node from "../Node"
import {DATA_TYPES} from "../../../../../engine/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"
import checkFloat from "../../../utils/checkFloat"


export default class Vec4 extends Node {
    v = [0, 0, 0, 0]
    uniform = false

    constructor() {
        super([
            {
                label: "Dynamic",
                key: "uniform",
                type: DATA_TYPES.CHECKBOX,
            },
            {label: "Vector", key: "v", type: DATA_TYPES.VEC4},
        ], [
            {label: "Value", key: "VEC4_VAR", type: DATA_TYPES.VEC4},
        ])

        this.name = "Vec4"
        this.size = 2
    }

    get type() {
        if (this.uniform)
            return NODE_TYPES.VARIABLE
        else
            return NODE_TYPES.STATIC
    }

     

    async getInputInstance(index, uniforms, uniformData) {
        if (this.uniform) {

            this.uniformName = `VEC4_VAR${index}`
            uniformData.push({
                key: this.uniformName,
                data: this.v,
                type: DATA_TYPES.VEC4
            })
            uniforms.push({
                label: this.name,
                key: this.uniformName,
                type: DATA_TYPES.VEC4,
                value: this.v
            })

            return `uniform float ${this.uniformName};`
        } else {
            this.uniformName = `VEC4_VAR${index}`

            return `#define ${this.uniformName} vec4(${checkFloat(this.v[0])}, ${checkFloat(this.v[1])}, ${checkFloat(this.v[2])}, ${checkFloat(this.v[3])})`
        }
    }

    getFunctionCall(_, index) {
        this.VEC4_VAR = "VEC4_VAR" + index
        return ""
    }
}