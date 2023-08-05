import AXIS from "../../static/AXIS"
import StaticMeshes from "../../../core/lib/StaticMeshes"
import GizmoState from "../util/GizmoState"
import GizmoUtil from "../util/GizmoUtil"
import AbstractSingleton from "../../../core/AbstractSingleton"
import IGizmo from "../IGizmo"
import Mesh from "../../../core/instances/Mesh"
import EditorEntity from "../../EditorEntity"
import PickingAPI from "../../../core/lib/utils/PickingAPI"

export default class ScreenSpaceGizmo extends AbstractSingleton implements IGizmo {
	mesh: Mesh
	xGizmo: EditorEntity
	yGizmo: EditorEntity
	zGizmo: EditorEntity


	drawGizmo() {
		GizmoUtil.drawGizmo(StaticMeshes.sphere, GizmoState.mainEntity.__cacheCenterMatrix, AXIS.SCREEN_SPACE)
	}

	drawToDepth(data: MutableObject) {
		GizmoUtil.drawToDepth(data, StaticMeshes.sphere, GizmoState.mainEntity.__cacheCenterMatrix, PickingAPI.getPickerId(1))
	}

	onMouseMove(){}

	transformGizmo(){}

	clearState(){}
}
