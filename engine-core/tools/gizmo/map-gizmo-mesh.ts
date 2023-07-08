import Entity from "../../core/instances/Entity"
import {mat4, quat, vec3, vec4} from "gl-matrix"
import PickingAPI from "../../core/lib/utils/PickingAPI"
import EntityAPI from "../../core/lib/utils/EntityAPI"

const toDeg = 57.29
const cacheVec4 = vec4.create()
export default function mapGizmoMesh(axis: string, type: string): Entity {
	const entity = EntityAPI.getNewEntityInstance()
	let s, r, index
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
	}

	quat.fromEuler(<quat>entity._rotationQuaternion, toDeg * r[0], toDeg * r[1], toDeg * r[2])
	const pickID = PickingAPI.getPickerId(index)
	entity.pickID[0] = pickID[0]
	entity.pickID[1] = pickID[1]
	entity.pickID[2] = pickID[2]
	vec3.copy(<vec3>entity._translation, <vec3>[0, 0, 0])
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