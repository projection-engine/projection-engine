import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine-core/static/DATA_TYPES"

import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"


export default class BreakVector extends ShaderNode {
    x = 0
    y = 0
    z = 0
    w = 0

    constructor() {
        super([
            {label: "Vector", key: "v", accept: [DATA_TYPES.VEC2, DATA_TYPES.VEC3, DATA_TYPES.VEC4]}
        ], [
            {label: "X", key: "x", type: DATA_TYPES.FLOAT, color: "red"},
            {label: "Y", key: "y", type: DATA_TYPES.FLOAT, color: "green"},
            {label: "Z", key: "z", type: DATA_TYPES.FLOAT, color: "blue"},
            {label: "W", key: "w", type: DATA_TYPES.FLOAT, color: "white"}
        ])

        this.name = "BreakVector"
        this.size = 1
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    getFunctionCall({v}, index, outputs) {
        let response = []
        outputs.forEach(o => {
            if (!this[o]) {
                this[o] = o + `${index}`

                if ((v.type === DATA_TYPES.VEC2 || v.type === DATA_TYPES.VEC3) && o === "w")
                    response.push(`float ${this[o]} = 0.;`)
                else if (v.type === DATA_TYPES.VEC2 && o === "z")
                    response.push(`float ${this[o]} = 0.;`)
                else
                    response.push(`float ${this[o]} = ${v.name}.${o};`)
            }
        })

        return response.join("\n")
    }

}