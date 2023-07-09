import AXIS from "../../static/AXIS"
import ConversionAPI from "../../../core/lib/math/ConversionAPI"
import {vec3} from "gl-matrix"
import StaticMeshes from "../../../core/lib/StaticMeshes"
import GizmoState from "../util/GizmoState"
import GizmoUtil from "../util/GizmoUtil"
import AbstractSingleton from "../../../../shared/AbstractSingleton"
import IGizmo from "../IGizmo"
import Mesh from "../../../core/instances/Mesh"
import Entity from "../../../core/instances/Entity"
import PickingAPI from "../../../core/lib/utils/PickingAPI"
import GizmoMouseUtil from "../util/GizmoMouseUtil"

export default class ScreenSpaceGizmo extends AbstractSingleton implements IGizmo {
	mesh: Mesh
	xGizmo: Entity
	yGizmo: Entity
	zGizmo: Entity

	static onMouseMove(event: MouseEvent): [number, number, number] {
		if (GizmoState.clickedAxis === AXIS.NONE)
			return [0, 0, 0]
		const cameraDistance = 100
		const x = event.movementX * cameraDistance * 1000
		const y = event.movementY * cameraDistance * 1000
		const ssP = <[number, number, number]>ConversionAPI.toWorldCoordinates(x, y).slice(0, 3)
		vec3.scale(ssP, ssP, 1 / cameraDistance ** 2)
		ScreenSpaceGizmo.#mapToAxis(ssP)
		return ssP
	}

	static #mapToAxis(vec: [number, number, number]) {
		switch (GizmoState.clickedAxis) {
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
		case AXIS.NONE:
			vec[0] = 0
			vec[1] = 0
			vec[2] = 0
			break
		}
	}

	drawGizmo() {
		GizmoUtil.drawGizmo(StaticMeshes.sphere, GizmoState.mainEntity.__cacheCenterMatrix, AXIS.SCREEN_SPACE)
	}

	drawToDepth(data: MutableObject) {
		GizmoMouseUtil.drawToDepth(data, StaticMeshes.sphere, GizmoState.mainEntity.__cacheCenterMatrix, PickingAPI.getPickerId(1))
	}

	onMouseMove(){}

	transformGizmo(){}

	clearState(){}
}