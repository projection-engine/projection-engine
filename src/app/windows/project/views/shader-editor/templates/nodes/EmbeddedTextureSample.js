import Node from "./Node"
import {DATA_TYPES} from "../../../../libs/engine/data/DATA_TYPES"
import NODE_TYPES from "../../data/NODE_TYPES"

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