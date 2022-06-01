import EditorCamera from "./camera/EditorCamera"
import CameraEvents from "./camera/CameraEvents"

export default class Cameras {
    #camera

    constructor(canvasRef, position = [0, 10, 30], fov = Math.PI / 2, zNear = .1, zFar = 10000, yaw, pitch) {
        this.#camera = new EditorCamera(position, fov, zNear, zFar, 1, yaw, pitch)

        this.cameraEvents = new CameraEvents(
            this.#camera,
            canvasRef,
            (x, y, ctrlKey) => this.onClick({x, y}, ctrlKey))
    }

    set cameraScrollDelay(data) {
        if (data !== undefined && data !== null) {
            this.cameraEvents.setCameraScrollDelay(data)
        }
    }

    set cameraScrollSpeed(data) {
        if (data !== undefined && data !== null) {
            this.cameraEvents.setCameraScrollSpeed(data)
        }
    }

    set cameraSpeed(data) {
        if (data !== undefined && data !== null) {
            this.cameraEvents.setCameraSpeed(data)
        }
    }


    get camera() {
        return this.#camera
    }

    set camera(data) {
        this.#camera = data
    }

    onClick() {
    }


}