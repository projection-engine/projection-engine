import Entity from "../../instances/Entity"
import {mat4, quat, vec3, vec4} from "gl-matrix"
import PickingAPI from "../../lib/utils/PickingAPI"
import EntityAPI from "../../lib/utils/EntityAPI"

const toDeg = 57.29
const cacheVec4 = vec4.create()
export default function mapGizmoMesh(axis: string, type: string): Entity {
	const entity = EntityAPI.getNewEntityInstance()
	let s, t = [0, 0, 0], r, index
	switch (axis) {
	case "x":
		index = 2
		break
	case "y":
		index = 3
		break
	case "z":
		index = 4
		break
	}
	switch (type) {
	case  "TRANSLATION":
		switch (axis) {
		case "x":
			s = [.75, 0.05, 0.05]
			r = [0, 0, 0]
			break
		case "y":
			s = [.75, 0.05, 0.05]
			r = [0, 0, 1.57]
			break
		case "z":
			s = [.75, 0.05, 0.05]
			r = [Math.PI, -1.57, Math.PI]
			break
		}
		break
	case "ROTATION":
		s = [1.5, .1, 1.5]
		switch (axis) {
		case "x":
			r = [0, 0, 1.57]
			break
		case "y":
			r = [0, 0, 0]
			break
		case "z":

			r = [1.57, 0, 0]
			break
		}
		break
	case "SCALE":
		switch (axis) {
		case "x":
			s = [.2, 0.2, 0.2]
			r = [0, 1.57, 0]
			break
		case "y":
			s = [.2, 0.2, 0.2]
			r = [-1.57, 1.57, 0]
			break
		case "z":
			s = [.2, 0.2, 0.2]
			r = [Math.PI, -Math.PI, Math.PI]
			break
		}
		break
	case "DUAL": {
		const SCALE = .5
		s = [SCALE, SCALE, SCALE]
		switch (axis) {
		case "XY":
			r = [1.57, 0, 0]
			break
		case "XZ":
			r = [Math.PI, -1.57, Math.PI]

			break
		case "ZY":
			r = [0, Math.PI, -1.57]
			break
		}
		break
	}
	}

	quat.fromEuler(<quat>entity._rotationQuaternion, toDeg * r[0], toDeg * r[1], toDeg * r[2])
	const pickID = PickingAPI.getPickerId(index)
	entity.pickID[0] = pickID[0]
	entity.pickID[1] = pickID[1]
	entity.pickID[2] = pickID[2]
	vec3.copy(<vec3>entity._translation, <vec3>t)
	vec3.copy(<vec3>entity._scaling, <vec3>s)
	const translation = entity._translation
	const rotate = entity._rotationQuaternion
	const scale = entity._scaling
	const matrix = entity.matrix
	quat.normalize(cacheVec4, <quat>rotate)
	mat4.fromRotationTranslationScale(matrix, cacheVec4, <vec3>translation, <vec3>scale)

	const M = new Float32Array(16)
	mat4.copy(M, entity.matrix)

	entity.__cacheMatrix = M

	return entity
}