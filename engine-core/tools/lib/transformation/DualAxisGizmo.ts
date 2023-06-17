import GizmoSystem from "../../runtime/GizmoSystem"
import AXIS from "../../static/AXIS"
import mapGizmoMesh from "../../utils/map-gizmo-mesh"
import GizmoAPI from "../GizmoAPI"
import StaticEditorShaders from "../StaticEditorShaders"
import StaticEditorMeshes from "../StaticEditorMeshes"
import PickingAPI from "../../../lib/utils/PickingAPI"

export const XZ_ID = PickingAPI.getPickerId(AXIS.XZ), XY_ID = PickingAPI.getPickerId(AXIS.XY), ZY_ID = PickingAPI.getPickerId(AXIS.ZY)
export default class DualAxisGizmo {
	static gizmos = {
		XY: mapGizmoMesh("XY", "DUAL"),
		XZ: mapGizmoMesh("XZ", "DUAL"),
		ZY: mapGizmoMesh("ZY", "DUAL")
	}

	static drawToBuffer(data) {
		StaticEditorShaders.toDepthBuffer.bindForUse({
			...data,
			transformMatrix: DualAxisGizmo.gizmos.XY.matrix,
			uID: XY_ID,
		})
		StaticEditorMeshes.dualAxisGizmo.draw()
		StaticEditorShaders.toDepthBuffer.bindForUse({
			...data,
			transformMatrix: DualAxisGizmo.gizmos.XZ.matrix,
			uID: XZ_ID,
		})
		StaticEditorMeshes.dualAxisGizmo.draw()
		StaticEditorShaders.toDepthBuffer.bindForUse({
			...data,
			transformMatrix: DualAxisGizmo.gizmos.ZY.matrix,
			uID: ZY_ID,
		})
		StaticEditorMeshes.dualAxisGizmo.draw()
	}


	static drawGizmo() {
		if (!GizmoSystem.mainEntity)
			return
		const meshToDraw = StaticEditorMeshes.dualAxisGizmo

		const gizmos = DualAxisGizmo.gizmos

		GizmoAPI.drawGizmo(
			meshToDraw,
			gizmos.XY.matrix,
			AXIS.XY
		)
		GizmoAPI.drawGizmo(
			meshToDraw,
			gizmos.XZ.matrix,
			AXIS.XZ
		)
		GizmoAPI.drawGizmo(
			meshToDraw,
			gizmos.ZY.matrix,
			AXIS.ZY
		)
	}
}