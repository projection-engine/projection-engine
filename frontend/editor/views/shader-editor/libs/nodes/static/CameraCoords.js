import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../material-compiler/templates/NODE_TYPES"


export default class CameraCoords extends ShaderNode {

    constructor() {
        super([], [
            {label: "Coordinates", key: "cameraPosition", type: DATA_TYPES.VEC3}
        ])

        this.name = "CameraCoords"
        this.size = 2
    }

    get type() {
        return NODE_TYPES.STATIC
    }
    getFunctionCall() {
        this.placement = "cameraPosition"
        return ""
    }
}