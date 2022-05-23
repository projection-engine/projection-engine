import EditorCamera from "./camera/EditorCamera";
import CameraEvents from "./camera/CameraEvents";

export default class Cameras {
    currentCoord = {x: 0, y: 0}
    clicked = false

    onClick = () => null

    constructor(canvasRef, position = [0, 10, 30], fov = Math.P / 2, zNear = .1, zFar = 10000, yaw, pitch) {
        this.camera = new EditorCamera(position, fov, zNear, zFar, 1, yaw, pitch)
        this.canvasID = canvasRef.id
        this.canvasRef = canvasRef

        this.cameraEvents = new CameraEvents(
            this.camera,
            canvasRef,
            (x, y, ctrlKey) => this.onClick({x, y}, ctrlKey))
    }
}