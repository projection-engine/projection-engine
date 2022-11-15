import GizmoSystem from "../../runtime/GizmoSystem";
import AXIS from "../../static/AXIS";
import CameraAPI from "../../../../../public/engine/lib/utils/CameraAPI";
import mapGizmoMesh from "../../utils/map-gizmo-mesh";
import getPickerId from "../../../../../public/engine/utils/get-picker-id";
import STATIC_MESHES from "../../../../../public/engine/static/resources/STATIC_MESHES";
import GPU from "../../../../../public/engine/GPU";

export const XZ_ID = getPickerId(AXIS.XZ), XY_ID = getPickerId(AXIS.XY), ZY_ID = getPickerId(AXIS.ZY)
export default class DualAxisGizmo {
    static matrixXZ
    static matrixXY
    static matrixZY

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
        gpu.disable(gpu.CULL_FACE)
        const clicked = GizmoSystem.clickedAxis
        const notSelected = !clicked || clicked <= 0
        const gizmos = DualAxisGizmo.gizmos

        if (clicked === AXIS.XY || notSelected)
            DualAxisGizmo.#draw(
                XY_ID,
                AXIS.XY,
                gizmos.XY.matrix
            )


        if (clicked === AXIS.XZ || notSelected)
            DualAxisGizmo.#draw(
                XZ_ID,
                AXIS.XZ,
                gizmos.XZ.matrix
            )


        if (clicked === AXIS.ZY || notSelected)
            DualAxisGizmo.#draw(
                ZY_ID,
                AXIS.ZY,
                gizmos.ZY.matrix
            )
        gpu.enable(gpu.CULL_FACE)
    }

    static #draw(uID, axis, transformMatrix, isSurface = false) {
        GizmoSystem.gizmoShader.bindForUse({
            transformMatrix,
            isDualAxis: true,
            translation: GizmoSystem.mainEntity.__pivotOffset,
            axis: isSurface ? undefined : axis,
            selectedAxis: GizmoSystem.clickedAxis,
            uID,
            cameraIsOrthographic: CameraAPI.isOrthographic,
            isSurface
        })
        if (!isSurface)
            GizmoSystem.dualAxisGizmoMesh.draw()
        else
            GPU.meshes.get(STATIC_MESHES.PRODUCTION.PLANE).draw()
    }
}