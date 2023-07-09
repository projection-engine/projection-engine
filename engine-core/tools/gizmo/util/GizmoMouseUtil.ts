import PickingAPI from "../../../core/lib/utils/PickingAPI"
import GPU from "../../../core/GPU"
import CameraAPI from "../../../core/lib/utils/CameraAPI"
import StaticFBO from "../../../core/lib/StaticFBO"
import AXIS from "../../static/AXIS"
import VisibilityRenderer from "../../../core/runtime/VisibilityRenderer"
import StaticEditorShaders from "../../utils/StaticEditorShaders"
import GizmoState from "./GizmoState"
import GizmoSystem from "../GizmoSystem"

export default class GizmoMouseUtil {

	static onMouseUp() {
		GizmoState.hasTransformationStarted = false
		document.exitPointerLock()
		GizmoState.clickedAxis = AXIS.NONE
		if (!GizmoState.mainEntity)
			return
		GizmoSystem.callListeners(true)
		GizmoSystem.onStop?.()
	}

	static onMouseDown(event: MouseEvent) {
		if (!GizmoState.mainEntity)
			return
		GizmoSystem.callListeners(true)
		GizmoMouseUtil.#drawGizmoToDepth()
		const axis = PickingAPI.readEntityID(event.clientX, event.clientY)
		if (axis === 0) {
			GizmoMouseUtil.onMouseUp()
			return
		}
		document.body.requestPointerLock()
		GizmoState.wasOnGizmo = true
		GizmoState.clickedAxis = axis
		GizmoSystem.onStart?.()
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

	static onMouseMove(event: MouseEvent) {
		for (let i = 0; i < GizmoState.targetGizmos.length; i++) {
			GizmoState.targetGizmos[i].onMouseMove(event)
		}
	}
}