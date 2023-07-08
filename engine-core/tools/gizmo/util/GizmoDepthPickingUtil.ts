import GizmoSystem from "../GizmoSystem"
import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import PickingAPI from "../../../core/lib/utils/PickingAPI"
import GPU from "../../../core/GPU"
import CameraAPI from "../../../core/lib/utils/CameraAPI"
import StaticFBO from "../../../core/lib/StaticFBO"
import StaticMeshes from "../../../core/lib/StaticMeshes"
import DualAxisGizmo from "../transformation/DualAxisGizmo"
import AXIS from "../../static/AXIS"
import VisibilityRenderer from "../../../core/runtime/VisibilityRenderer"
import StaticEditorShaders from "../../utils/StaticEditorShaders"

export default class GizmoDepthPickingUtil{
	static onMouseDown(event: MouseEvent) {
		if (!GizmoSystem.mainEntity)
			return
		GizmoSystem.targetGizmo.transformGizmo()
		const targetGizmo = GizmoSystem.targetGizmo
		targetGizmo.transformGizmo()
		GizmoDepthPickingUtil.#drawGizmoToDepth(StaticEditorMeshes.rotationGizmo, [
			targetGizmo.xGizmo.matrix,
			targetGizmo.yGizmo.matrix,
			targetGizmo.zGizmo.matrix,
		])
		GizmoSystem.clickedAxis = PickingAPI.readEntityID(event.clientX, event.clientY)

		if (!GizmoSystem.clickedAxis)
			targetGizmo.onMouseUp()
		else {
			GizmoSystem.wasOnGizmo = true
			GPU.canvas.requestPointerLock()
		}
	}

	static #drawGizmoToDepth(mesh, transforms) {
		const data = {
			translation: GizmoSystem.mainEntity.__pivotOffset,
			cameraIsOrthographic: CameraAPI.isOrthographic
		}
		StaticFBO.visibility.startMapping()
		GPU.context.disable(GPU.context.CULL_FACE)
		for (let i = 0; i < transforms.length; i++) {
			GizmoDepthPickingUtil.#drawToDepth(data, mesh, transforms[i], PickingAPI.getPickerId(i + 2))
		}
		if (GizmoSystem.targetGizmo !== GizmoSystem.rotationGizmo) {
			GizmoDepthPickingUtil.#drawToDepth(data, StaticMeshes.sphere, GizmoSystem.mainEntity.__cacheCenterMatrix, PickingAPI.getPickerId(1))
		}

		GizmoDepthPickingUtil.#drawToDepth(data, StaticEditorMeshes.dualAxisGizmo, DualAxisGizmo.xyGizmo.matrix, PickingAPI.getPickerId(AXIS.XY))
		GizmoDepthPickingUtil.#drawToDepth(data, StaticEditorMeshes.dualAxisGizmo, DualAxisGizmo.xzGizmo.matrix, PickingAPI.getPickerId(AXIS.XZ))
		GizmoDepthPickingUtil.#drawToDepth(data, StaticEditorMeshes.dualAxisGizmo, DualAxisGizmo.zyGizmo.matrix, PickingAPI.getPickerId(AXIS.ZY))

		StaticFBO.visibility.stopMapping()
		VisibilityRenderer.needsUpdate = true
		GPU.context.enable(GPU.context.CULL_FACE)
	}

	static #drawToDepth(data, mesh, transformation, pickId) {
		data.transformMatrix = transformation
		data.uID = pickId
		StaticEditorShaders.toDepthBuffer.bindForUse(data)
		mesh.draw()
	}
}