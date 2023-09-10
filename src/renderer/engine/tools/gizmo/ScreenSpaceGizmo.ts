import AXIS from "../static/AXIS"
import StaticMeshesState from "@engine-core/states/StaticMeshesState"
import GizmoState from "../state/GizmoState"
import AbstractSingleton from "@engine-core/AbstractSingleton"
import Mesh from "@engine-core/lib/resources/Mesh"
import PickingUtil from "@engine-core/utils/PickingUtil"
import GizmoEntity from "./GizmoEntity";
import {vec3} from "gl-matrix";
import GizmoRenderingUtil from "../utils/GizmoRenderingUtil";

export default class ScreenSpaceGizmo extends AbstractSingleton implements IGizmo {
	mesh: Mesh
	xGizmo: GizmoEntity
	yGizmo: GizmoEntity
	zGizmo: GizmoEntity

	drawGizmo() {
		GizmoRenderingUtil.drawGizmo(StaticMeshesState.sphere, GizmoState.mainEntity.__cacheCenterMatrix, AXIS.SCREEN_SPACE)
	}

	drawToDepth(data: MutableObject) {
		GizmoRenderingUtil.drawToDepth(data, StaticMeshesState.sphere, GizmoState.mainEntity.__cacheCenterMatrix, <vec3>PickingUtil.getPickerId(1))
	}

	onMouseMove(){}

	transformGizmo(){}

	clearState(){}
}
