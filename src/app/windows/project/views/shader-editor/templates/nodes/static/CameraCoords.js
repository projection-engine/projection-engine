import Node from "../Node"
import DATA_TYPES from "../../../../../libs/engine/data/DATA_TYPES"
import NODE_TYPES from "../../../data/NODE_TYPES"


export default class CameraCoords extends Node {

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