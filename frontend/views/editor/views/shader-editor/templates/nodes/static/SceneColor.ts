import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../../engine-core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"


export default class SceneColor extends ShaderNode {
    constructor() {
        super(
            [],
            [{label: "Sampler", key: "previousFrame", type: DATA_TYPES.TEXTURE}]
        )

        this.name = "SceneColor"
    }

    get type() {
        return NODE_TYPES.STATIC
    }

    getFunctionCall() {
        this.previousFrame = "previousFrame"
        return ""
    }
}