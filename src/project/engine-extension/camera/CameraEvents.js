import EditorCamera from "./EditorCamera"
import KEYS from "../../engine/templates/KEYS"
import {rotateY} from "../../components/viewport/transformCamera"
import CAMERA_GIZMO from "../../../static/misc/CAMERA_GIZMO"

const BUTTON_MIDDLE = 1
export default function CameraEvents(c) {
    let isFocused = false
    let requested = false
    let doubleClick = false
    let holding = false
    let ctrl = false
    let camera = c
    let cameraSpeed = 0.01
    let interval, increment = 0, scrollSpeed = .5, cameraScrollDelay = 100
    const cameraGizmo = document.getElementById(CAMERA_GIZMO)

    function handleInput(event) {
        switch (event.type) {
        case "wheel":
            const forward = event.deltaY < 0
            const distance = (forward ? 1 : -1) * scrollSpeed * (camera.animated ? 1 : 3)

            if (camera.animated) {
                const s = Math.sign(increment)
                if (Math.sign(distance) !== s)
                    increment = 0
                increment += distance
                if (interval)
                    clearInterval(interval)
                let percentage = Math.abs(increment / cameraScrollDelay)

                interval = setInterval(() => {
                    if (s < 0 && increment <= 0 || s > 0 && increment >= 0) {
                        camera.radius -= increment * percentage
                        camera.updateViewMatrix()
                        if (s > 0)
                            increment -= percentage
                        else
                            increment += percentage
                    } else
                        clearInterval(interval)
                }, 1)
            } else {
                camera.radius -= distance
                camera.updateViewMatrix()
            }
            break
        case "mousemove":
            if (isFocused || doubleClick) {
                if (!requested) {
                    requested = true
                    window.gpu.canvas.requestPointerLock()
                }
                if (!doubleClick) {
                    if (event.movementY < 0)
                        camera.pitch += .01 * Math.abs(event.movementY)

                    else if (event.movementY > 0)
                        camera.pitch -= .01 * Math.abs(event.movementY)

                    if (event.movementX > 0 && camera instanceof EditorCamera)
                        camera.yaw += .01 * Math.abs(event.movementX)
                    else if (event.movementX < 0 && camera instanceof EditorCamera)
                        camera.yaw -= .01 * Math.abs(event.movementX)

                } else {
                    const newPosition = rotateY(camera.yaw, [ctrl ? 0 : cameraSpeed * event.movementY, 0, -cameraSpeed * event.movementX])

                    camera.centerOn[0] += newPosition[0]
                    camera.centerOn[1] -= ctrl ? .1 * event.movementY : newPosition[1]
                    camera.centerOn[2] += newPosition[2]
                }
                camera.updateViewMatrix(ctrl)

                if(!doubleClick && cameraGizmo){
                    const t = camera.getNotTranslatedViewMatrix()
                    cameraGizmo.style.transform = `translateZ(calc(var(--cubeSize) * -3)) matrix3d(${t})`
                }

            }
            break
        case "mousedown":
            if (holding)
                doubleClick = true
            if (event.button === BUTTON_MIDDLE) {
                isFocused = true
            }else
                holding = true
            break
        case "mouseup":
            holding = false
            ctrl = false
            requested = false
            isFocused = false
            document.exitPointerLock()
            doubleClick = false
            break
        case "keyup":
        case "keydown":
            if (event.code === KEYS.ControlLeft || event.code === KEYS.ControlRight)
                ctrl = event.type === "keydown"
            break
        default:
            break
        }

    }


    const r = {
        startTracking: () => {
            document.addEventListener("keydown", handleInput)
            document.addEventListener("keyup", handleInput)
            window.gpu.canvas.addEventListener("mousedown", handleInput)
            document.addEventListener("mouseup", handleInput)
            document.addEventListener("mousemove", handleInput)
            window.gpu.canvas.addEventListener("wheel", handleInput, {passive: true})
        },
        stopTracking: () => {
            document.removeEventListener("keydown", handleInput)
            document.removeEventListener("keyup", handleInput)
            window.gpu.canvas.removeEventListener("mousedown", handleInput)
            document.removeEventListener("mouseup", handleInput)
            document.removeEventListener("mousemove", handleInput)
            window.gpu.canvas.removeEventListener("wheel", handleInput)
        },
    }
    return r
}