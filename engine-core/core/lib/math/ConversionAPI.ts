import {mat4, vec3, vec4} from "gl-matrix"
import CameraAPI from "../utils/CameraAPI"

/**
 * @field canvasBBox - Bounding box for canvas; updated on engine resize observer
 */

export default class ConversionAPI {
	static canvasBBox?: DOMRect

	static toQuadCoord(coords: { x: number, y: number }, quadSize: { w: number, h: number }): { x: number, y: number } {
		const target = ConversionAPI.canvasBBox
		const {x, y} = coords
		const {w, h} = quadSize

		const multiplierX = w / target.width
		const multiplierY = h / target.height

		return {
			x: x * multiplierX - target.left * multiplierX,
			y: h - y * multiplierY + target.top * multiplierY - 1
		}
	}

	static toWorldCoordinates(x, y): vec3 {
		const cameraDistance = vec3.len(<vec3>CameraAPI.position)
		const bBox = ConversionAPI.canvasBBox
		const normalizedX = ((x  -bBox.x) / bBox.width) * 2 - 1
		const normalizedY = 1 - ((y - bBox.y) / bBox.height) * 2
		const homogeneousCoordinates = vec4.fromValues(normalizedX * cameraDistance, normalizedY * cameraDistance, 1, 1)

		const invMat = mat4.mul(mat4.create(), CameraAPI.invViewMatrix, CameraAPI.invProjectionMatrix)
		const transformedVector = vec4.create()
		vec4.transformMat4(transformedVector, homogeneousCoordinates, invMat)
		return [transformedVector[0], transformedVector[1], transformedVector[2]]
	}

	static toLinearWorldCoordinates(x, y): vec4 {
		const eyeCoords = vec4.create()
		// EYE SPACE
		vec4.transformMat4(eyeCoords, [x, y, 0, 0], CameraAPI.invProjectionMatrix)
		eyeCoords[2] = -1
		eyeCoords[3] = 1

		// WORLD SPACE
		return vec4.transformMat4(vec4.create(), eyeCoords, CameraAPI.invViewMatrix)
	}

	static toScreenCoordinates(vec: vec3): [number, number] {
		const target = <vec4>[...vec, 1]
		vec4.transformMat4(target, target, CameraAPI.viewMatrix)
		vec4.transformMat4(target, target, CameraAPI.projectionMatrix)

		// NORMALIZED DEVICE SPACE
		const bBox = ConversionAPI.canvasBBox
		const widthHalf = bBox.width / 2
		const heightHalf = bBox.height / 2

		target[0] = ((target[0] / target[3] + 1) * widthHalf)
		target[1] = ((target[1] / target[3] + 1) * heightHalf)

		return [target[0], target[1]]
	}
}