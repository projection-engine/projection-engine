import Node from "../Node"
import DATA_TYPES from "../../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../../../public/engine/editor/libs/material-compiler/templates/NODE_TYPES"
import checkGlslFloat from "../../../utils/check-glsl-float"


export default class Float extends Node {
    v = 0
    uniform = false

    constructor() {
        super([
            {
                label: "Dynamic",
                key: "uniform",
                type: DATA_TYPES.CHECKBOX,
            },
            {label: "Value", key: "v", type: DATA_TYPES.FLOAT},
        ], [
            {label: "Value", key: "FLOAT_VAR", type: DATA_TYPES.FLOAT},
        ])

        this.name = "Float"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.STATIC
    }

    async getInputInstance(index, uniforms, uniformData) {
        if (this.uniform) {
            this.uniformName = `FLOAT_VAR${index}`
            uniformData.push({
                label: this.name,
                key: this.uniformName,
                type: DATA_TYPES.FLOAT,
                data: this.v
            })
            uniforms.push({
                label: this.name,
                key: this.uniformName,
                type: DATA_TYPES.FLOAT
            })

            return `uniform float ${this.uniformName};`
        } else {
            this.uniformName = `FLOAT_VAR${index}`
            return `#define ${this.uniformName} ${checkGlslFloat(this.v)}`
        }
    }

    getFunctionCall(_, index) {
        this.FLOAT_VAR = "FLOAT_VAR" + index
        return ""
    }
}