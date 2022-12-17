import GizmoSystem from "../../runtime/GizmoSystem";
import AXIS from "../../static/AXIS";
import mapGizmoMesh from "../../utils/map-gizmo-mesh";
import getPickerId from "../../../engine-core/utils/get-picker-id";
import GizmoAPI from "../GizmoAPI";

export const XZ_ID = getPickerId(AXIS.XZ), XY_ID = getPickerId(AXIS.XY), ZY_ID = getPickerId(AXIS.ZY)
export default class DualAxisGizmo {
    static gizmos = {
        XY: mapGizmoMesh("XY", "DUAL"),
        XZ: mapGizmoMesh("XZ", "DUAL"),
        ZY: mapGizmoMesh("ZY", "DUAL")
    }

    static drawToBuffer(data) {
        GizmoSystem.toBufferShader.bindForUse({
            ...data,
            transformMatrix: DualAxisGizmo.gizmos.XY.matrix,
            uID: XY_ID,
        })
        GizmoSystem.dualAxisGizmoMesh.draw()
        GizmoSystem.toBufferShader.bindForUse({
            ...data,
            transformMatrix: DualAxisGizmo.gizmos.XZ.matrix,
            uID: XZ_ID,
        })
        GizmoSystem.dualAxisGizmoMesh.draw()
        GizmoSystem.toBufferShader.bindForUse({
            ...data,
            transformMatrix: DualAxisGizmo.gizmos.ZY.matrix,
            uID: ZY_ID,
        })
        GizmoSystem.dualAxisGizmoMesh.draw()
    }


    static drawGizmo() {
        if (!GizmoSystem.mainEntity)
            return
        const meshToDraw = GizmoSystem.dualAxisGizmoMesh

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