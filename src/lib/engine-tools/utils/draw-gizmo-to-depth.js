import CameraAPI from "../../../../public/engine/lib/utils/CameraAPI";
import getPickerId from "../../../../public/engine/utils/get-picker-id";
import DualAxisGizmo from "../lib/transformation/DualAxisGizmo";
import GizmoSystem from "../runtime/GizmoSystem";
import VisibilityBuffer from "../../../../public/engine/runtime/rendering/VisibilityBuffer";

export default function drawGizmoToDepth(mesh, transforms){
    const FBO = VisibilityBuffer.buffer
    const data = {
        translation: GizmoSystem.mainEntity.__pivotOffset,
        cameraIsOrthographic: CameraAPI.isOrthographic
    }
    gpu.disable(gpu.CULL_FACE)
    FBO.startMapping()

    for (let i = 0; i < transforms.length; i++) {
        GizmoSystem.toBufferShader.bindForUse({
            ...data,
            transformMatrix: transforms[i],
            uID: getPickerId(i + 2),
        })
        mesh.draw()
    }

    GizmoSystem.toBufferShader.bindForUse({
        ...data,
        transformMatrix: GizmoSystem.mainEntity.__cacheCenterMatrix,
        uID: getPickerId(1)
    })
    GizmoSystem.screenSpaceMesh.draw()

    DualAxisGizmo.drawToBuffer(data)
    FBO.stopMapping()

    gpu.enable(gpu.CULL_FACE)
}