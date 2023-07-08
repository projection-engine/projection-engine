import GizmoSystem from "../GizmoSystem"
import AXIS from "../../static/AXIS"
import GizmoAPI from "../util/GizmoAPI"
import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import PickingAPI from "../../../core/lib/utils/PickingAPI"
import {mat4, vec3} from "gl-matrix"
import GizmoUtil from "../util/GizmoUtil"

export default class DualAxisGizmo {
	static xyGizmo
	static xzGizmo
	static zyGizmo
	static XZ_ID = PickingAPI.getPickerId(AXIS.XZ)
	static XY_ID = PickingAPI.getPickerId(AXIS.XY)
	static ZY_ID = PickingAPI.getPickerId(AXIS.ZY)
	static initialize() {
		DualAxisGizmo.xyGizmo = DualAxisGizmo.#mapGizmoMesh("XY", 2)
		DualAxisGizmo.xzGizmo = DualAxisGizmo.#mapGizmoMesh("XZ", 3)
		DualAxisGizmo.zyGizmo = DualAxisGizmo.#mapGizmoMesh("ZY", 4)
	}

	static #mapGizmoMesh(axis: string, index: number) {
		const rotation = vec3.create()
		const scale = vec3.fromValues(.5, .5, .5)
		switch (axis) {
		case "XY":
			vec3.copy(rotation, [Math.PI / 2, 0, 0])
			break
		case "XZ":
			vec3.copy(rotation, [Math.PI, -Math.PI / 2, Math.PI])
			break
		case "ZY":
			vec3.copy(rotation, [0, Math.PI, -Math.PI / 2])
			break
		}
		return GizmoUtil.getGizmoEntity(index, rotation, scale)
	}

	static transformGizmo(){
		mat4.copy(DualAxisGizmo.xyGizmo.matrix, DualAxisGizmo.xyGizmo.__cacheMatrix)
		mat4.copy(DualAxisGizmo.zyGizmo.matrix, DualAxisGizmo.zyGizmo.__cacheMatrix)
		mat4.copy(DualAxisGizmo.xzGizmo.matrix, DualAxisGizmo.xzGizmo.__cacheMatrix)
		GizmoAPI.translateMatrix(DualAxisGizmo.xyGizmo)
		GizmoAPI.translateMatrix(DualAxisGizmo.zyGizmo)
		GizmoAPI.translateMatrix(DualAxisGizmo.xzGizmo)
	}


	static drawGizmo() {
		if (!GizmoSystem.mainEntity)
			return
		const meshToDraw = StaticEditorMeshes.dualAxisGizmo

		GizmoAPI.drawGizmo(
			meshToDraw,
			DualAxisGizmo.xyGizmo.matrix,
			AXIS.XY
		)
		GizmoAPI.drawGizmo(
			meshToDraw,
			DualAxisGizmo.xzGizmo.matrix,
			AXIS.XZ
		)
		GizmoAPI.drawGizmo(
			meshToDraw,
			DualAxisGizmo.zyGizmo.matrix,
			AXIS.ZY
		)
	}
}