import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../lib/engine-tools/lib/material-compiler/templates/NODE_TYPES"


export default class CameraCoords extends ShaderNode {

    constructor() {
        super([], [
            {label: "Coordinates", key: "cameraVec", type: DATA_TYPES.VEC3}
        ])

        this.name = "CameraCoords"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.STATIC
    }
    getFunctionCall() {
        this.cameraVec = "cameraVec"
        return ""
    }
}