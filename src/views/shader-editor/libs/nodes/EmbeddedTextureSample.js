import ShaderNode from "../ShaderNode"
import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"

export default class EmbeddedTextureSample extends ShaderNode {
    texture = ""
    constructor() {
        super([
            { key: "texture", type: DATA_TYPES.TEXTURE}
        ], [{key: "rgb", type: DATA_TYPES.VEC3, disabled: true}])
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }
}