import AXIS from "../static/AXIS"
import StaticMeshesState from "@engine-core/states/StaticMeshesState"
import GizmoState from "./util/GizmoState"
import GizmoUtil from "./util/GizmoUtil"
import AbstractSingleton from "@engine-core/AbstractSingleton"
import IGizmo from "./IGizmo"
import Mesh from "@engine-core/instances/Mesh"
import PickingAPI from "@engine-core/lib/utils/PickingAPI"
import GizmoEntity from "./GizmoEntity";
import {vec3} from "gl-matrix";

export default class ScreenSpaceGizmo extends AbstractSingleton implements IGizmo {
	mesh: Mesh
	xGizmo: GizmoEntity
	yGizmo: GizmoEntity
	zGizmo: GizmoEntity

	drawGizmo() {
		GizmoUtil.drawGizmo(StaticMeshesState.sphere, GizmoState.mainEntity.__cacheCenterMatrix, AXIS.SCREEN_SPACE)
	}

	drawToDepth(data: MutableObject) {
		GizmoUtil.drawToDepth(data, StaticMeshesState.sphere, GizmoState.mainEntity.__cacheCenterMatrix, <vec3>PickingAPI.getPickerId(1))
	}

	onMouseMove(){}

	transformGizmo(){}

	clearState(){}
}
