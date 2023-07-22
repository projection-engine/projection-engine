import {mat4, vec3, vec4} from "gl-matrix"
import CameraAPI from "../utils/CameraAPI"

/**
 * @field canvasBBox - Bounding box for canvas; updated on engine resize observer
 */

export default class ConversionAPI {
	static canvasBBox?: DOMRect

	static toQuadCoordinates(pointerX:number, pointerY:number, quadWidth:number, quadHeight:number): { x: number, y: number } {
		const target = ConversionAPI.canvasBBox
		const multiplierX = quadWidth / target.width
		const multiplierY = quadHeight / target.height

		return {
			x: pointerX * multiplierX - target.left * multiplierX,
			y: quadHeight - pointerY * multiplierY + target.top * multiplierY - 1
		}
	}

	static toWorldCoordinates(x, y, scale = 1): vec3 {

		// NORMALIZED DEVICE SPACE
		const bBox = ConversionAPI.canvasBBox
		const xNormalized = ((x  - bBox.x) / bBox.width) * 2 - 1
		const yNormalized = -((y - bBox.y) / bBox.height) * 2 + 1
		// HOMOGENEOUS CLIP SPACE
		const homogeneousCoords = vec4.fromValues(xNormalized * scale, yNormalized * scale, 0, 0)

		// EYE SPACE
		const eyeCoords = vec4.transformMat4(homogeneousCoords, homogeneousCoords, CameraAPI.invProjectionMatrix)

		// WORLD SPACE
		return vec3.transformMat4(<vec3>eyeCoords, <vec3>eyeCoords, mat4.invert(mat4.create(), CameraAPI.staticViewMatrix))
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
