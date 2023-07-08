import GizmoAPI from "../util/GizmoAPI"
import GizmoSystem from "../GizmoSystem"
import AXIS from "../../static/AXIS"
import ConversionAPI from "../../../core/lib/math/ConversionAPI"
import {vec3} from "gl-matrix"
import StaticMeshes from "../../../core/lib/StaticMeshes"

export default class ScreenSpaceGizmo {
	static onMouseMove(event:MouseEvent): [number, number, number] {
		if (GizmoSystem.clickedAxis < 0)
			return [0, 0, 0]
		const cameraDistance = 100
		const x = event.movementX * cameraDistance * 1000
		const y = event.movementY * cameraDistance * 1000
		const ssP = <[number, number, number]>ConversionAPI.toWorldCoordinates(x, y).slice(0, 3)
		vec3.scale(ssP, ssP, 1 / cameraDistance ** 2)
		ScreenSpaceGizmo.mapToAxis(ssP)
		return ssP
	}

	static mapToAxis(vec:[number, number, number]) {
		const axis = GizmoSystem.clickedAxis
		if (axis < 0) {
			vec[0] = 0
			vec[1] = 0
			vec[2] = 0
		}
		switch (axis) {
		case AXIS.X:
			vec[1] = 0
			vec[2] = 0
			break
		case AXIS.Y:
			vec[0] = 0
			vec[2] = 0
			break
		case AXIS.Z:
			vec[0] = 0
			vec[1] = 0
			break
		case AXIS.XZ:
			vec[1] = 0
			break
		case AXIS.XY:
			vec[2] = 0
			break
		case AXIS.ZY:
			vec[0] = 0
			break
		}
	}

	static drawGizmo() {
		GizmoAPI.drawGizmo(StaticMeshes.sphere, GizmoSystem.mainEntity.__cacheCenterMatrix, AXIS.SCREEN_SPACE)
	}
}