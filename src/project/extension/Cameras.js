import EditorCamera from "./camera/EditorCamera";
import CameraEvents from "./camera/CameraEvents";

const toRad = 180 / Math.PI
export default class Cameras {
    currentCoord = {x: 0, y: 0}
    clicked = false
    #useBackupCamera = false
    #cameraBackup
    #camera
    constructor(canvasRef, position = [0, 10, 30], fov = Math.PI / 2, zNear = .1, zFar = 10000, yaw, pitch) {
        this.#camera = new EditorCamera(position, fov, zNear, zFar, 1, yaw, pitch)
        this.#cameraBackup = new EditorCamera([0, 0, 10], 60 * toRad, .1, 100000, 1, 0, 0)
        this.canvasID = canvasRef.id
        this.canvasRef = canvasRef

        this.cameraEvents = new CameraEvents(
            this.#camera,
            canvasRef,
            (x, y, ctrlKey) => this.onClick({x, y}, ctrlKey))
    }
    set cameraScrollDelay(data){
        if(data !== undefined && data !== null){
            this.cameraEvents.setCameraScrollDelay(data)
        }
    }
    set cameraScrollSpeed(data){
        if(data !== undefined && data !== null){
            this.cameraEvents.setCameraScrollSpeed(data)
        }
    }
    set cameraSpeed(data){
        if(data !== undefined && data !== null){
            this.cameraEvents.setCameraSpeed(data)
        }
    }

    set useBackupCamera(data) {
        if(data !== this.#useBackupCamera) {
            this.cameraEvents.changeCamera(data ? this.#cameraBackup : this.#camera)
            this.#useBackupCamera = data
        }
    }

    get camera() {
        if (this.#useBackupCamera)
            return this.#cameraBackup
        return this.#camera
    }

    set camera(data) {
        if (this.#useBackupCamera)
            this.#cameraBackup = data
        else
            this.#camera = data
    }

    onClick() {
    }


}