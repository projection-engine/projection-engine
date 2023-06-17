import GizmoSystem from "../runtime/GizmoSystem"
import ScreenSpaceGizmo from "../lib/transformation/ScreenSpaceGizmo"
import EngineTools from "../EngineTools"
import {quat, vec3, vec4} from "gl-matrix"
import ScalingGizmo from "../lib/transformation/ScalingGizmo"
import AXIS from "../static/AXIS"
import GizmoAPI from "../lib/GizmoAPI"

function getAxisMovement(event) {
	return Math.abs(event.movementX) > Math.abs(event.movementY) ? event.movementX : event.movementY
}

const INVERSE_CACHE = vec3.create()
const SCALE_CACHE = quat.create()
export default function gizmoScaleEntity(event) {
	const CACHE = <vec3>ScalingGizmo.cache
	const firstEntity = GizmoSystem.mainEntity
	if (!firstEntity)
		return
	const isGlobal = GizmoAPI.isGlobal
	const g = event.ctrlKey ? 1 : ScalingGizmo.gridSize
	if(GizmoSystem.clickedAxis !== AXIS.SCREEN_SPACE) {
		const c = ScreenSpaceGizmo.onMouseMove(event)
		SCALE_CACHE[0] = c[0]
		SCALE_CACHE[1] = c[1]
		SCALE_CACHE[2] = c[2]
	}
	switch (GizmoSystem.clickedAxis) {
	case AXIS.SCREEN_SPACE:
		SCALE_CACHE[0] = SCALE_CACHE[1] = SCALE_CACHE[2] = getAxisMovement(event) / 50
		break
	case AXIS.XY:
		SCALE_CACHE[2] = 0
		break
	case AXIS.XZ:
		SCALE_CACHE[1] = 0
		break
	case AXIS.ZY:
		SCALE_CACHE[0] = 0
		break
	default:

		break
	}


	if (isGlobal) {
		vec4.transformQuat(SCALE_CACHE, <vec4>SCALE_CACHE, GizmoSystem.targetRotation)
		vec3.add(CACHE, CACHE, <vec3>SCALE_CACHE)
	} else
		vec3.add(CACHE, CACHE, <vec3>SCALE_CACHE)


	if (Math.abs(CACHE[0]) >= g || Math.abs(CACHE[1]) >= g || Math.abs(CACHE[2]) >= g) {
		const hasToTranslate = isGlobal && event.altKey
		if (hasToTranslate)
			vec3.scale(INVERSE_CACHE, CACHE, -1)
		const entities = EngineTools.selected
		const SIZE = entities.length
		if (SIZE === 1 && entities[0].lockedScaling)
			return
		for (let i = 0; i < SIZE; i++) {
			const target = entities[i]
			if (target.lockedScaling)
				continue

			vec3.add(target._scaling, target._scaling, CACHE)
			if (hasToTranslate)
				vec3.add(target._translation, target._translation, INVERSE_CACHE)
			for (let j = 0; j < 3; j++)
				target._scaling[j] = Math.round(target._scaling[j] / g) * g
			target.__changedBuffer[0] = 1
		}
		CACHE[0] = CACHE[2] = CACHE[1] = 0


	}
	SCALE_CACHE[2] = SCALE_CACHE[1] = SCALE_CACHE[0] = 0
}