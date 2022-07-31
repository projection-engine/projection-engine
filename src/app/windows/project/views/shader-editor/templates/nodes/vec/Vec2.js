import Node from "../Node"
import DATA_TYPES from "../../../../../libs/engine/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"
import checkGlslFloat from "../../../utils/check-glsl-float"


export default class Vec2 extends Node {
    v = [0,0]
    uniform = false

    constructor() {
        super([
            {
                label: "Dynamic",
                key: "uniform",
                type: DATA_TYPES.CHECKBOX,
            },
            {label: "Vector", key: "v", type: DATA_TYPES.VEC2},
        ], [
            {label: "Value", key: "VEC2_VAR", type: DATA_TYPES.VEC2},
        ])

        this.name = "Vec2"
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

            this.uniformName = `VEC2_VAR${index}`
            uniformData.push({
                key: this.uniformName,
                data: this.v,
                type: DATA_TYPES.VEC2
            })
            uniforms.push({
                label: this.name,
                key: this.uniformName,
                type: DATA_TYPES.VEC2,
                value: this.v
            })

            return `uniform float ${this.uniformName};`
        } else {
            this.uniformName = `VEC2_VAR${index}`
            return `#define ${this.uniformName} vec2(${checkGlslFloat(this.v[0])}, ${checkGlslFloat(this.v[1])})`
        }
    }

    getFunctionCall(_, index) {
        this.VEC2_VAR = "VEC2_VAR" + index
        return ""
    }
}