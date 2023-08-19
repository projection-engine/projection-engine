import {quat, vec3} from "gl-matrix"
import ArrayBufferUtil from "../utils/ArrayBufferUtil"
import CameraEffects from "../lib/CameraEffects"
import CameraNotificationDecoder from "../lib/CameraNotificationDecoder"


/**
 * @field notificationBuffers {float32array [viewNeedsUpdate, projectionNeedsUpdate, isOrthographic, hasChanged, translationSmoothing,  elapsed]}
 * @field transformationBuffer {float32array [translation.x, translation.y, translation.z, rotation.x, rotation.y, rotation.z, rotation.w]}
 * @field projectionBuffer {float32array [zFar, zNear, fov, aR, orthographicSize]}
 */
export default class CameraState extends CameraEffects {
	static position = ArrayBufferUtil.allocateVector(3) as Float32Array
	static viewMatrix = ArrayBufferUtil.allocateMatrix(4, true)
	static projectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
	static invViewMatrix = ArrayBufferUtil.allocateMatrix(4, true)
	static invProjectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
	static viewProjectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
	static previousViewProjectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
	static staticViewMatrix = ArrayBufferUtil.allocateMatrix(4, true)
	static skyboxProjectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
	static invSkyboxProjectionMatrix = ArrayBufferUtil.allocateMatrix(4, true)
	static viewUBOBuffer = ArrayBufferUtil.allocateVector(52)
	static projectionUBOBuffer = ArrayBufferUtil.allocateVector(35)
	static projectionBuffer = ArrayBufferUtil.allocateVector(5)
	static translationBuffer = <vec3>ArrayBufferUtil.allocateVector(3)
	static rotationBuffer = <quat>ArrayBufferUtil.allocateVector(4, 0, true)
	static notificationBuffers = CameraNotificationDecoder.generateBuffer()


	static addTranslation(data: number[] | Float32Array) {
		const T = CameraState.translationBuffer
		T[0] = T[0] + data[0] || 0
		T[1] = T[1] + data[1] || 0
		T[2] = T[2] + data[2] || 0
	}

	static updateTranslation(data: number[] | Float32Array) {
		const T = CameraState.translationBuffer
		T[0] = data[0] || 0
		T[1] = data[1] || 0
		T[2] = data[2] || 0
	}

	static updateRotation(data: number[] | Float32Array) {
		const R = CameraState.rotationBuffer

		R[0] = data[0] || 0
		R[1] = data[1] || 0
		R[2] = data[2] || 0
		R[3] = data[3] || 0
	}


	static get zFar() {
		return CameraState.projectionBuffer[0]
	}

	static get zNear() {
		return CameraState.projectionBuffer[1]
	}

	static get fov() {
		return CameraState.projectionBuffer[2]
	}

	static get aspectRatio() {
		return CameraState.projectionBuffer[3]
	}

	static get orthographicProjectionSize() {
		return CameraState.projectionBuffer[4]
	}

	static set zFar(data) {
		CameraState.projectionBuffer[0] = data
	}

	static set zNear(data) {
		CameraState.projectionBuffer[1] = data
	}

	static set fov(data) {
		CameraState.projectionBuffer[2] = data
	}

	static set aspectRatio(data) {
		CameraState.projectionBuffer[3] = data
	}

	static set orthographicProjectionSize(data) {
		CameraState.projectionBuffer[4] = data
	}

}

