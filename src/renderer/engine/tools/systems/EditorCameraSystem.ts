import CameraAPI from "../../core/lib/utils/CameraAPI"
import {quat, vec4} from "gl-matrix"
import CAMERA_ROTATIONS from "../static/CAMERA_ROTATIONS"
import GPU from "../../core/GPU"
import AbstractSystem from "../../core/AbstractSystem";

let holding = false

const toDeg = 180 / Math.PI, halfPI = Math.PI / 2
const MOUSE_RIGHT = 2, MOUSE_LEFT = 0
const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
const toApplyTranslation = vec4.create()
const cacheRotation = quat.create()
const cachePitch = quat.create()
const cacheYaw = quat.create()

export default class EditorCameraSystem extends AbstractSystem{
	static #isTracking = false
	static #hasInitializedEvents = false
	static #xRotation = 0
	static #yRotation = 0

	static set xRotation(data: number) {
		if (isNaN(data))
			return
		EditorCameraSystem.#xRotation = data
	}

	static set yRotation(data: number) {
		if (isNaN(data))
			return
		EditorCameraSystem.#yRotation = data
	}

	static get xRotation() {
		return EditorCameraSystem.#xRotation
	}

	static get yRotation() {
		return EditorCameraSystem.#yRotation
	}

	static screenSpaceMovementSpeed = 1
	static movementSpeed = 0.1
	static turnSpeed = .1
	static gizmoReference:HTMLElement
	static screenSpaceMovement = false
	static rotationChanged = false
	static forceUpdate = false
	static movementKeys = {
		forward: "KeyW",
		backward: "KeyS",
		left: "KeyA",
		right: "KeyD",
		invertDirection: false,
		fasterJonny: "ShiftLeft",
		mouseLeft: false,
		mouseRight: false,
	}
	static #keysOnHold = {
		forward: false,
		backward: false,
		left: false,
		right: false,

		mouseLeft: false,
		mouseRight: false,
		fasterJonny: false
	}

	execute() {
		if (CameraAPI.hasChangedView && EditorCameraSystem.gizmoReference)
			EditorCameraSystem.gizmoReference.style.transform = `translateZ(calc(var(--cube-size) * -3)) matrix3d(${CameraAPI.staticViewMatrix})`

		const map = EditorCameraSystem.#keysOnHold
		let changed = EditorCameraSystem.forceUpdate

		if (!changed) {
			toApplyTranslation[0] = 0
			toApplyTranslation[1] = 0
			toApplyTranslation[2] = 0
			toApplyTranslation[3] = 1
		}

		const multiplier = map.fasterJonny ? 10 * EditorCameraSystem.movementSpeed : EditorCameraSystem.movementSpeed
		if (map.left) {
			toApplyTranslation[0] -= multiplier
			changed = true
		}
		if (map.right) {
			toApplyTranslation[0] += multiplier
			changed = true
		}
		if (map.backward) {
			if (CameraAPI.isOrthographic)
				CameraAPI.orthographicProjectionSize += multiplier
			else
				toApplyTranslation[2] += multiplier
			changed = true
		}
		if (map.forward) {
			if (CameraAPI.isOrthographic)
				CameraAPI.orthographicProjectionSize -= multiplier
			else
				toApplyTranslation[2] -= multiplier
			changed = true
		}

		if (EditorCameraSystem.rotationChanged) {
			EditorCameraSystem.rotationChanged = false

			const pitch = quat.fromEuler(cachePitch, EditorCameraSystem.yRotation * toDeg, 0, 0)
			const yaw = quat.fromEuler(cacheYaw, 0, EditorCameraSystem.xRotation * toDeg, 0)
			quat.copy(cacheRotation, pitch)
			quat.multiply(cacheRotation, yaw, cacheRotation)
			CameraAPI.updateRotation(cacheRotation)
			changed = true
		}

		if (changed)
			EditorCameraSystem.#transform()
	}

	static #transform() {
		EditorCameraSystem.forceUpdate = false
		vec4.transformQuat(toApplyTranslation, toApplyTranslation, CameraAPI.rotationBuffer)

		CameraAPI.addTranslation(toApplyTranslation)
		CameraAPI.updateView()
	}

	static forceRotationTracking() {
		if (!holding) {
			GPU.canvas.requestPointerLock()
			document.addEventListener("mousemove", EditorCameraSystem.#handleInput)
			holding = true
		}
		EditorCameraSystem.#keysOnHold.mouseLeft = true
	}


	static #handleInput(event) {
		if (!EditorCameraSystem.#isTracking)
			return

		const keys = EditorCameraSystem.movementKeys
		const map = EditorCameraSystem.#keysOnHold
		try {
			switch (event.type) {
			case "mousemove": {
				if (!document.pointerLockElement)
					GPU.canvas.requestPointerLock()
				if (EditorCameraSystem.screenSpaceMovement) {
					toApplyTranslation[0] = -event.movementX * EditorCameraSystem.screenSpaceMovementSpeed / 2
					toApplyTranslation[1] = event.movementY * EditorCameraSystem.screenSpaceMovementSpeed / 2
					toApplyTranslation[2] = 0
					toApplyTranslation[3] = 1
					EditorCameraSystem.forceUpdate = true
				} else {

					if (map.mouseLeft && map.mouseRight || event.ctrlKey) {
						const multiplier = EditorCameraSystem.#keysOnHold.fasterJonny ? 10 * EditorCameraSystem.movementSpeed : EditorCameraSystem.movementSpeed
						toApplyTranslation[0] = -event.movementX * multiplier
						toApplyTranslation[1] = event.movementY * multiplier
						toApplyTranslation[2] = 0
						toApplyTranslation[3] = 1
						EditorCameraSystem.forceUpdate = true
					} else {
						EditorCameraSystem.rotationChanged = true
						let multiplier = -1
						if (EditorCameraSystem.movementKeys.invertDirection)
							multiplier = 1
						EditorCameraSystem.xRotation += multiplier * event.movementX * EditorCameraSystem.turnSpeed
						EditorCameraSystem.yRotation += multiplier * event.movementY * EditorCameraSystem.turnSpeed
						EditorCameraSystem.yRotation = clamp(EditorCameraSystem.yRotation, -halfPI, halfPI)
					}
				}
				break
			}
			case "mousedown":
				if (event.button === MOUSE_LEFT)
					map.mouseLeft = true
				if (event.button === MOUSE_RIGHT)
					map.mouseRight = true

				if (!holding && map.mouseRight === true) {
					if (EditorCameraSystem.screenSpaceMovement)
						GPU.canvas.style.cursor = "grabbing"
					document.addEventListener("mousemove", EditorCameraSystem.#handleInput)
					holding = true
				}


				break
			case "mouseup":
				document.exitPointerLock()
				if (event.button === MOUSE_LEFT)
					map.mouseLeft = false
				if (event.button === MOUSE_RIGHT)
					map.mouseRight = false


				if (!keys.mouseRight && !keys.mouseLeft) {
					if (EditorCameraSystem.screenSpaceMovement)
						GPU.canvas.style.cursor = "default"
					document.removeEventListener("mousemove", EditorCameraSystem.#handleInput)
					holding = false
				}
				break
			case "keyup":
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
				break
			case "keydown":
				if (!document.pointerLockElement)
					return
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
				break
			case "pointerlockchange":
				if (!document.pointerLockElement) {
					const map = EditorCameraSystem.#keysOnHold
					map.forward = false
					map.backward = false
					map.left = false
					map.right = false
					map.fasterJonny = false
				}
				break
			case "wheel":

				event.preventDefault()
				const multiplier = event.ctrlKey ? 10 * 2 : 2
				if (CameraAPI.isOrthographic)
					CameraAPI.orthographicProjectionSize += multiplier * Math.sign(event.deltaY)
				else {
					toApplyTranslation[0] = toApplyTranslation[1] = 0
					toApplyTranslation[2] += multiplier * Math.sign(event.deltaY)
					toApplyTranslation[3] = 1
				}
				EditorCameraSystem.#transform()
				break
			default:
				break
			}
		} catch (err) {
			console.error(err)
		}
	}

	static startTracking() {
		if (EditorCameraSystem.#isTracking)
			return
		EditorCameraSystem.#isTracking = true
		if (!EditorCameraSystem.#hasInitializedEvents) {
			document.addEventListener("pointerlockchange", EditorCameraSystem.#handleInput)
			document.addEventListener("keydown", EditorCameraSystem.#handleInput)
			document.addEventListener("keyup", EditorCameraSystem.#handleInput)
			document.addEventListener("mouseup", EditorCameraSystem.#handleInput)
			GPU.canvas.addEventListener("mousedown", EditorCameraSystem.#handleInput)
			GPU.canvas.addEventListener("wheel", EditorCameraSystem.#handleInput)
			EditorCameraSystem.#hasInitializedEvents = true
		}
	}

	static stopTracking() {
		EditorCameraSystem.#isTracking = false
	}


	static rotate(direction) {
		function updateCameraPlacement(yaw, pitch) {
			CameraAPI.updateProjection()
			EditorCameraSystem.yRotation = pitch
			EditorCameraSystem.xRotation = yaw
			EditorCameraSystem.rotationChanged = true
		}

		vec4.copy(CameraAPI.rotationBuffer, [0, 0, 0, 1])

		switch (direction) {
		case CAMERA_ROTATIONS.TOP:
			updateCameraPlacement(0, -Math.PI / 2 - .001)
			break
		case CAMERA_ROTATIONS.BOTTOM:
			updateCameraPlacement(0, Math.PI / 2 - .001)
			break
		case CAMERA_ROTATIONS.BACK:
			updateCameraPlacement(Math.PI, 0)
			break
		case CAMERA_ROTATIONS.FRONT:
			updateCameraPlacement(0, 0)
			break
		case CAMERA_ROTATIONS.RIGHT:
			updateCameraPlacement(Math.PI / 2, 0)
			break
		case CAMERA_ROTATIONS.LEFT:
			updateCameraPlacement(Math.PI * 1.5, 0)
			break
		}
	}
}
