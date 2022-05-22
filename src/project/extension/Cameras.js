import CAMERA_TYPES from "./camera/CAMERA_TYPES";
import SphericalCamera from "./camera/SphericalCamera";
import FreeCamera from "./camera/FreeCamera";

import perspectiveCameraEvents from "./camera/perspectiveCameraEvents";

export default class Cameras {
    currentCoord = {x: 0, y: 0}
    clicked = false

    sphericalCamera = new SphericalCamera([0, 10, 30], 1.57, .1, 10000, 1)
    freeCamera = new FreeCamera([0, 10, 30], 1.57, .1, 10000, 1)

    onClick = () => null

    constructor(cameraType, canvasRef) {
        this.camera = this.sphericalCamera
        this.canvasID = canvasRef.id
        this.canvasRef = canvasRef

        this.cameraType = cameraType

        this._resetCameraEvents()
    }

    _resetCameraEvents() {
        this.cameraEvents = new perspectiveCameraEvents(
            this.camera,
            this.canvasID,
            (x, y, ctrlKey) => this.onClick({x, y}, ctrlKey))

    }

    changeCamera(newType) {
        this.cameraEvents.stopTracking()
        let cameraToApply

        switch (newType) {
            case CAMERA_TYPES.FREE:
                cameraToApply = this.freeCamera
                break
            default:
                cameraToApply = this.sphericalCamera
                break
        }
        const bBox = this.canvasRef.getBoundingClientRect()
        cameraToApply.aspectRatio = bBox.width / bBox.height

        this.camera = cameraToApply
        this._resetCameraEvents()

        this.cameraEvents.startTracking()
    }

}