import Node from "./Node"
import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../public/engine/editor/libs/material-compiler/templates/NODE_TYPES"

export default class EmbeddedTextureSample extends Node {
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