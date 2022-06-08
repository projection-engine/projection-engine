import EditorCamera from "./EditorCamera"
import KEYS from "../../engine/templates/KEYS"
import {rotateY} from "../../components/viewport/transformCamera"

const BUTTON_LEFT = 0
export default function CameraEvents(c, canvas, onClick) {
    let isFocused = false
    let positionChanged = false
    let requested = false
    let doubleClick = false
    let ctrl = false
    let camera = c
    let cameraSpeed = 0.01
    let interval, increment = 0, scrollSpeed = .5, cameraScrollDelay = 100

    function handleInput(event) {
        switch (event.type) {
        case "wheel":
            const forward = event.deltaY < 0
            const distance = (forward ? 1 : -1) * scrollSpeed

            if (cameraScrollDelay > 0) {
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
                        if (s > 0)
                            increment -= percentage
                        else
                            increment += percentage
                    } else
                        clearInterval(interval)
                }, 1)
            } else
                camera.radius -= distance
            break
        case "mousemove":
            positionChanged = true
            if (isFocused) {
                if (!requested) {
                    requested = true
                    canvas.requestPointerLock()
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
            }
            break
        case "mousedown":
            if (isFocused)
                doubleClick = true
            if (event.button === BUTTON_LEFT) {
                isFocused = true
                ctrl = event.ctrlKey
            }
            break
        case "mouseup":
            ctrl = false
            requested = false
            isFocused = false
            positionChanged = false
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

    function handleClick(event) {
        if (!positionChanged && event.target === canvas) {
            const target = canvas.getBoundingClientRect()
            onClick(event.clientX - target.left, event.clientY - target.top, event.ctrlKey)
        }
    }

    const r = {
        startTracking: () => {
            document.addEventListener("keydown", handleInput)
            document.addEventListener("keyup", handleInput)
            canvas.addEventListener("click", handleClick)
            canvas.addEventListener("mousedown", handleInput)
            document.addEventListener("mouseup", handleInput)
            document.addEventListener("mousemove", handleInput)
            canvas.addEventListener("wheel", handleInput, {passive: true})
        },
        stopTracking: () => {
            document.removeEventListener("keydown", handleInput)
            document.removeEventListener("keyup", handleInput)
            canvas.removeEventListener("click", handleClick)
            canvas.removeEventListener("mousedown", handleInput)
            document.removeEventListener("mouseup", handleInput)
            document.removeEventListener("mousemove", handleInput)
            canvas.removeEventListener("wheel", handleInput)
        },
    }
    return {
        ...r,
        changeCamera: (c) => {
            r.stopTracking()
            camera = c
            r.startTracking()
        },
        setCameraSpeed: (data) => {
            r.stopTracking()
            cameraSpeed = data
            r.startTracking()
        },
        setCameraScrollSpeed: (data) => {
            r.stopTracking()
            scrollSpeed = data
            r.startTracking()
        },
        setCameraScrollDelay: (data) => {
            r.stopTracking()
            cameraScrollDelay = data
            r.startTracking()
        }
    }
}