import Node from "./Node"
import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../public/engine/editor-environment/lib/material-compiler/templates/NODE_TYPES"
import checkGlslFloat from "../../utils/check-glsl-float"


export default class RGB extends Node {
    rgb = [0, 0, 0]
    uniform = false

    constructor() {
        super([
            {
                label: "Dynamic",
                key: "uniform",
                type: DATA_TYPES.CHECKBOX
            },
            {label: "Color", key: "rgb", type: DATA_TYPES.COLOR},
        ], [
            {label: "Value", key: "COLOR_RGB", type: DATA_TYPES.VEC3},
        ])
        this.name = "RGB"
    }

    get type() {
        return NODE_TYPES.STATIC
    }

    async getInputInstance(index, uniforms, uniformData) {
        const v = this.rgb
        if (this.uniform) {
            this.uniformName = `COLOR_RGB${index}`
            uniformData.push({
                label: this.name,
                key: this.uniformName,
                type: DATA_TYPES.VEC3,
                data: v,
                isColor: true
            })
            uniforms.push({
                label: this.name,
                key: this.uniformName,
                type: DATA_TYPES.VEC3,
            })

            return `uniform vec3 ${this.uniformName};`
        } else {
            this.uniformName = `COLOR_RGB${index}`
            return `#define ${this.uniformName} vec3(${checkGlslFloat(v[0])}, ${checkGlslFloat(v[1])}, ${checkGlslFloat(v[2] )})`
        }
    }

    getFunctionCall(_, index) {
        this.COLOR_RGB = "COLOR_RGB" + index
        return ""
    }
}