import ShaderNode from "../ShaderNode"
import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"

export default class SceneColor extends ShaderNode {

    constructor() {
        super([
            {label: "UV", key: "uv", accept: [DATA_TYPES.VEC2]},
        ], [
            {label: "RGB", key: "rgb", type: DATA_TYPES.VEC3},
            {label: "R", key: "r", type: DATA_TYPES.FLOAT, color: "red"},
            {label: "G", key: "g", type: DATA_TYPES.FLOAT, color: "green"},
            {label: "B", key: "b", type: DATA_TYPES.FLOAT, color: "blue"},
            {label: "Alpha", key: "a", type: DATA_TYPES.FLOAT, color: "white"}
        ])
        this.name = "SceneColor"
    }

    get type() {
        return NODE_TYPES.STATIC
    }

    getFunctionCall({uv}, index, outputs) {
        let response = [
            `vec4 samplerSceneColor = texture(sceneColor, ${uv !== undefined ? uv.name : "texCoords"});`
        ]

        outputs.forEach(o => {
            if (!this[o]) {
                this[o] = o + `${index}`
                const outputKey = this.output.find(oo => oo.key === o)
                response.push(`${outputKey.type} ${this[o]} = samplerSceneColor.${o};`)
            }
        })
        return response.join("\n")
    }
}