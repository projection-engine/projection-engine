import {mat4} from "gl-matrix"
import GizmoSystem from "./GizmoSystem"
import AXIS from "../static/AXIS"
import DualAxisGizmo from "./transformation/DualAxisGizmo"
import GizmoAPI from "./util/GizmoAPI"
import EditorActionHistory from "../../../frontend/editor/services/EditorActionHistory"
import EngineTools from "../EngineTools"
import GizmoInterface from "./GizmoInterface"
import GizmoDepthPickingUtil from "./util/GizmoDepthPickingUtil"

export default class Inheritance extends GizmoInterface  {

	onMouseMove(event?:MouseEvent) {
		if (!GizmoSystem.hasStarted) {
			GizmoSystem.hasStarted = true
			EditorActionHistory.save(EngineTools.selected)
			GizmoSystem.updateGizmoToolTip()
		}
	}

	onMouseDown(event: MouseEvent) {
		GizmoDepthPickingUtil.onMouseDown(event)
	}

	onMouseUp() {
		if (GizmoSystem.hasStarted) {
			GizmoSystem.hasStarted = false
			EditorActionHistory.save(EngineTools.selected)
		}
		GizmoSystem.hasStarted = false
		document.exitPointerLock()
		GizmoSystem.clickedAxis = -1
		GizmoSystem.targetGizmo.transformGizmo()
	}


	transformGizmo() {
		if (!GizmoSystem.mainEntity)
			return
		mat4.copy(this.xGizmo.matrix, this.xGizmo.__cacheMatrix)
		mat4.copy(this.yGizmo.matrix, this.yGizmo.__cacheMatrix)
		mat4.copy(this.zGizmo.matrix, this.zGizmo.__cacheMatrix)

		DualAxisGizmo.transformGizmo()

		GizmoAPI.translateMatrix(this.xGizmo)
		GizmoAPI.translateMatrix(this.yGizmo)
		GizmoAPI.translateMatrix(this.zGizmo)
	}

	drawGizmo() {
		if (!GizmoSystem.mainEntity)
			return

		DualAxisGizmo.drawGizmo()
		GizmoAPI.drawGizmo(this.xyz, this.xGizmo.matrix, AXIS.X)
		GizmoAPI.drawGizmo(this.xyz, this.yGizmo.matrix, AXIS.Y)
		GizmoAPI.drawGizmo(this.xyz, this.zGizmo.matrix, AXIS.Z)
	}
}
