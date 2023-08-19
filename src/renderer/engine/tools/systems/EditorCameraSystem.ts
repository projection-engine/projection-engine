import CameraManager from "@engine-core/managers/CameraManager"
import {quat, vec4} from "gl-matrix"
import CAMERA_ROTATIONS from "../static/CAMERA_ROTATIONS"
import GPU from "../../core/GPU"
import AbstractSystem from "../../core/AbstractSystem";


export default class EditorCameraSystem extends AbstractSystem {
    #isHoldingCanvas = false
    #TO_DEG = 180 / Math.PI
    #HALF_PI = Math.PI / 2
    #MOUSE_RIGHT = 2
    #MOUSE_LEFT = 0
    #clamp = (num, min, max) => Math.min(Math.max(num, min), max)
    #toApplyTranslation = vec4.create()
    #cacheRotation = quat.create()
    #cachePitch = quat.create()
    #cacheYaw = quat.create()
    #isTracking = false
    #hasInitializedEvents = false
    #yawAngle = 0
    #pitchAngle = 0
    #screenSpaceMovementSpeed = 1
    #movementSpeed = 0.1
    #turnSpeed = .1
    #screenSpaceMovement = false
    #isRotationChanged = false
    #forceUpdate = false
    #movementKeys: EditorCameraKeys = {
        forward: "KeyW",
        backward: "KeyS",
        left: "KeyA",
        right: "KeyD",
        invertDirection: false,
        fasterJonny: "ShiftLeft",
        mouseLeft: false,
        mouseRight: false,
    }
    #keysOnHold: EditorCameraActionMap = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        mouseLeft: false,
        mouseRight: false,
        fasterJonny: false
    }

    execute() {
        const map = this.#keysOnHold
        let changed = this.#forceUpdate

        if (!changed) {
            this.#toApplyTranslation[0] = 0
            this.#toApplyTranslation[1] = 0
            this.#toApplyTranslation[2] = 0
            this.#toApplyTranslation[3] = 1
        }

        const multiplier = map.fasterJonny ? 10 * this.#movementSpeed : this.#movementSpeed
        if (map.left) {
            this.#toApplyTranslation[0] -= multiplier
            changed = true
        }
        if (map.right) {
            this.#toApplyTranslation[0] += multiplier
            changed = true
        }
        if (map.backward) {
            if (CameraManager.isOrthographic)
                CameraManager.orthographicProjectionSize += multiplier
            else
                this.#toApplyTranslation[2] += multiplier
            changed = true
        }
        if (map.forward) {
            if (CameraManager.isOrthographic)
                CameraManager.orthographicProjectionSize -= multiplier
            else
                this.#toApplyTranslation[2] -= multiplier
            changed = true
        }

        if (this.#isRotationChanged) {
            this.#isRotationChanged = false

            const pitch = quat.fromEuler(this.#cachePitch, this.#pitchAngle * this.#TO_DEG, 0, 0)
            const yaw = quat.fromEuler(this.#cacheYaw, 0, this.#yawAngle * this.#TO_DEG, 0)
            quat.copy(this.#cacheRotation, pitch)
            quat.multiply(this.#cacheRotation, yaw, this.#cacheRotation)
            CameraManager.updateRotation(this.#cacheRotation)
            changed = true
        }

        if (changed)
            this.#transform()
    }

    static forceRotationTracking() {
        const instance = this.get<EditorCameraSystem>()
        if (!instance.#isHoldingCanvas) {
            GPU.canvas.requestPointerLock()
            document.addEventListener("mousemove", EditorCameraSystem.#handleInput)
            instance.#isHoldingCanvas = true
        }
        instance.#keysOnHold.mouseLeft = true
    }


    static #handleInput(event) {
        const instance = this.get<EditorCameraSystem>()
        if (!instance.#isTracking)
            return
        const keys = instance.#movementKeys
        const map = instance.#keysOnHold
        try {
            switch (event.type) {
                case "mousemove": {
                    instance.#onMouseMove(event, map);
                    break
                }
                case "mousedown":
                    instance.#onMouseDown(event, map);
                    break
                case "mouseup":
                    instance.#onMouseUp(event, map, keys);
                    break
                case "keyup":
                    instance.#onKeyUp(event, keys, map);
                    break
                case "keydown":
                    instance.#onKeyDown(event, keys, map);
                    break
                case "pointerlockchange":
                    instance.#onPointerLockChange();
                    break
                case "wheel":
                    instance.#onWheel(event);
                    break
            }
        } catch (err) {
            console.error(err)
        }
    }

    #onMouseMove(event, map: EditorCameraActionMap) {
        if (!document.pointerLockElement)
            GPU.canvas.requestPointerLock()
        if (this.#screenSpaceMovement) {
            this.#toApplyTranslation[0] = -event.movementX * this.#screenSpaceMovementSpeed / 2
            this.#toApplyTranslation[1] = event.movementY * this.#screenSpaceMovementSpeed / 2
            this.#toApplyTranslation[2] = 0
            this.#toApplyTranslation[3] = 1
            this.#forceUpdate = true
        } else {
            if (map.mouseLeft && map.mouseRight || event.ctrlKey) {
                const multiplier = this.#keysOnHold.fasterJonny ? 10 * this.#movementSpeed : this.#movementSpeed
                this.#toApplyTranslation[0] = -event.movementX * multiplier
                this.#toApplyTranslation[1] = event.movementY * multiplier
                this.#toApplyTranslation[2] = 0
                this.#toApplyTranslation[3] = 1
                this.#forceUpdate = true
            } else {
                this.#isRotationChanged = true
                let multiplier = -1
                if (this.#movementKeys.invertDirection)
                    multiplier = 1
                this.#yawAngle += multiplier * event.movementX * this.#turnSpeed
                this.#pitchAngle += multiplier * event.movementY * this.#turnSpeed
                this.#pitchAngle = this.#clamp(this.#pitchAngle, -this.#HALF_PI, this.#HALF_PI)
            }
        }
    }

    #onMouseDown(event, map: EditorCameraActionMap) {
        if (event.button === this.#MOUSE_LEFT)
            map.mouseLeft = true
        if (event.button === this.#MOUSE_RIGHT)
            map.mouseRight = true

        if (!this.#isHoldingCanvas && map.mouseRight === true) {
            if (this.#screenSpaceMovement)
                GPU.canvas.style.cursor = "grabbing"
            document.addEventListener("mousemove", EditorCameraSystem.#handleInput)
            this.#isHoldingCanvas = true
        }
    }

    #onMouseUp(event, map: EditorCameraActionMap, keys: EditorCameraKeys) {
        document.exitPointerLock()
        if (event.button === this.#MOUSE_LEFT)
            map.mouseLeft = false
        if (event.button === this.#MOUSE_RIGHT)
            map.mouseRight = false
        if (!keys.mouseRight && !keys.mouseLeft) {
            if (this.#screenSpaceMovement)
                GPU.canvas.style.cursor = "default"
            document.removeEventListener("mousemove", EditorCameraSystem.#handleInput)
            this.#isHoldingCanvas = false
        }
    }

    #onKeyUp(event, keys: EditorCameraKeys, map: EditorCameraActionMap) {
        switch (event.code) {
            case keys.forward:
                map.forward = false
                break
            case keys.backward:
                map.backward = false
                break
            case keys.left:
                map.left = false
                break
            case keys.right:
                map.right = false
                break
            case keys.fasterJonny:
                map.fasterJonny = false
        }
    }

    #onKeyDown(event, keys: EditorCameraKeys, map: EditorCameraActionMap) {
        if (document.pointerLockElement)
            switch (event.code) {
                case keys.forward:
                    map.forward = true
                    break
                case keys.backward:
                    map.backward = true
                    break
                case keys.left:
                    map.left = true
                    break
                case keys.right:
                    map.right = true
                    break
                case keys.fasterJonny:
                    map.fasterJonny = true
                    break
            }
    }

    #onPointerLockChange() {
        if (!document.pointerLockElement) {
            const map = this.#keysOnHold
            map.forward = false
            map.backward = false
            map.left = false
            map.right = false
            map.fasterJonny = false
        }
    }

    #onWheel(event) {
        event.preventDefault()
        const multiplier = event.ctrlKey ? 10 * 2 : 2
        if (CameraManager.isOrthographic)
            CameraManager.orthographicProjectionSize += multiplier * Math.sign(event.deltaY)
        else {
            this.#toApplyTranslation[0] = this.#toApplyTranslation[1] = 0
            this.#toApplyTranslation[2] += multiplier * Math.sign(event.deltaY)
            this.#toApplyTranslation[3] = 1
        }
        this.#transform()
    }

    #transform() {
        this.#forceUpdate = false
        vec4.transformQuat(this.#toApplyTranslation, this.#toApplyTranslation, CameraManager.rotationBuffer)

        CameraManager.addTranslation(this.#toApplyTranslation)
        CameraManager.updateView()
    }

    static startTracking() {
        const instance = this.get<EditorCameraSystem>()
        if (instance.#isTracking)
            return
        instance.#isTracking = true
        if (!instance.#hasInitializedEvents) {
            document.addEventListener("pointerlockchange", EditorCameraSystem.#handleInput)
            document.addEventListener("keydown", EditorCameraSystem.#handleInput)
            document.addEventListener("keyup", EditorCameraSystem.#handleInput)
            document.addEventListener("mouseup", EditorCameraSystem.#handleInput)
            GPU.canvas.addEventListener("mousedown", EditorCameraSystem.#handleInput)
            GPU.canvas.addEventListener("wheel", EditorCameraSystem.#handleInput)
            instance.#hasInitializedEvents = true
        }
    }

    static stopTracking() {
        const instance = this.get<EditorCameraSystem>()
        instance.#isTracking = false
    }

    static #updateCameraPlacement(yaw, pitch) {
        const instance = this.get<EditorCameraSystem>()
        CameraManager.updateProjection()
        instance.#pitchAngle = pitch
        instance.#yawAngle = yaw
        instance.#isRotationChanged = true
    }

    static rotate(direction) {
        vec4.copy(CameraManager.rotationBuffer, [0, 0, 0, 1])

        switch (direction) {
            case CAMERA_ROTATIONS.TOP:
                EditorCameraSystem.#updateCameraPlacement(0, -Math.PI / 2 - .001)
                break
            case CAMERA_ROTATIONS.BOTTOM:
                EditorCameraSystem.#updateCameraPlacement(0, Math.PI / 2 - .001)
                break
            case CAMERA_ROTATIONS.BACK:
                EditorCameraSystem.#updateCameraPlacement(Math.PI, 0)
                break
            case CAMERA_ROTATIONS.FRONT:
                EditorCameraSystem.#updateCameraPlacement(0, 0)
                break
            case CAMERA_ROTATIONS.RIGHT:
                EditorCameraSystem.#updateCameraPlacement(Math.PI / 2, 0)
                break
            case CAMERA_ROTATIONS.LEFT:
                EditorCameraSystem.#updateCameraPlacement(Math.PI * 1.5, 0)
                break
        }
    }


    static setYawPitch(yaw: number, pitch: number) {
        const instance = this.get<EditorCameraSystem>()
        instance.#yawAngle = yaw !== undefined ? yaw : instance.#yawAngle
        instance.#pitchAngle = pitch !== undefined ? pitch : instance.#pitchAngle
    }

    static getYawPitch(): { yaw: number, pitch: number } {
        const instance = this.get<EditorCameraSystem>()
        return {yaw: instance.#yawAngle, pitch: instance.#pitchAngle}
    }

    static updateProperties(param: {
        screenSpaceMovementSpeed?: number,
        movementSpeed?: number,
        turnSpeed?: number,
        forceUpdate?: boolean,
        screenSpaceMovement?: boolean
    }) {
        const instance = this.get<EditorCameraSystem>()
        instance.#screenSpaceMovementSpeed = Object.hasOwn(param, "screenSpaceMovementSpeed") ? param.screenSpaceMovementSpeed : instance.#screenSpaceMovementSpeed
        instance.#movementSpeed = Object.hasOwn(param, "movementSpeed") ? param.movementSpeed : instance.#movementSpeed
        instance.#turnSpeed = Object.hasOwn(param, "turnSpeed") ? param.turnSpeed : instance.#turnSpeed
        instance.#screenSpaceMovement = Object.hasOwn(param, "screenSpaceMovement") ? param.screenSpaceMovement : instance.#screenSpaceMovement
        instance.#forceUpdate = Object.hasOwn(param, "forceUpdate") ? param.forceUpdate : instance.#forceUpdate
    }
}
