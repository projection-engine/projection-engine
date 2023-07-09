import PickingAPI from "../../../core/lib/utils/PickingAPI"
import GPU from "../../../core/GPU"
import CameraAPI from "../../../core/lib/utils/CameraAPI"
import StaticFBO from "../../../core/lib/StaticFBO"
import AXIS from "../../static/AXIS"
import VisibilityRenderer from "../../../core/runtime/VisibilityRenderer"
import StaticEditorShaders from "../../utils/StaticEditorShaders"
import GizmoState from "./GizmoState"

export default class GizmoMouseUtil {

	static onMouseUp() {
		GizmoState.hasTransformationStarted = false
		document.exitPointerLock()
		GizmoState.clickedAxis = AXIS.NONE
		if (!GizmoState.mainEntity)
			return
		for (let i = 0; i < GizmoState.targetGizmos.length; i++) {
			GizmoState.targetGizmos[i].transformGizmo()
		}
	}
	
	static onMouseDown(event: MouseEvent) {
		if (!GizmoState.mainEntity)
			return
		for (let i = 0; i < GizmoState.targetGizmos.length; i++) {
			const gizmo = GizmoState.targetGizmos[i]
			gizmo.transformGizmo()
			gizmo.clearState()
		}
		GizmoMouseUtil.#drawGizmoToDepth()
		GizmoState.clickedAxis = PickingAPI.readEntityID(event.clientX, event.clientY)

		if (!GizmoState.clickedAxis) {
			GizmoMouseUtil.onMouseUp()
		}
		else {
			GizmoState.wasOnGizmo = true
			GPU.canvas.requestPointerLock()
		}
	}

	static #drawGizmoToDepth() {
		const data = {
			translation: GizmoState.mainEntity.__pivotOffset,
			cameraIsOrthographic: CameraAPI.isOrthographic
		}
		StaticFBO.visibility.startMapping()
		GPU.context.disable(GPU.context.CULL_FACE)
		for (let i = 0; i < GizmoState.targetGizmos.length; i++) {
			GizmoState.targetGizmos[i].drawToDepth(data)
		}
		StaticFBO.visibility.stopMapping()
		VisibilityRenderer.needsUpdate = true
		GPU.context.enable(GPU.context.CULL_FACE)
	}

	static drawToDepth(data, mesh, transformation, pickId) {
		data.transformMatrix = transformation
		data.uID = pickId
		StaticEditorShaders.toDepthBuffer.bindForUse(data)
		mesh.draw()
	}

	static onMouseMove(event:MouseEvent){
		for (let i = 0; i < GizmoState.targetGizmos.length; i++) {
			GizmoState.targetGizmos[i].onMouseMove(event)
		}
	}
}