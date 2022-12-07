import CameraAPI from "../../../../../public/engine/lib/utils/CameraAPI";
import getPickerId from "../../../../../public/engine/utils/get-picker-id";
import DualAxisGizmo from "../lib/transformation/DualAxisGizmo";
import GizmoSystem from "../runtime/GizmoSystem";
import VisibilityBuffer from "../../../../../public/engine/runtime/rendering/VisibilityBuffer";
import GPU from "../../../../../public/engine/GPU";
import STATIC_FRAMEBUFFERS from "../../../../../public/engine/static/resources/STATIC_FRAMEBUFFERS";

export default function drawGizmoToDepth(mesh, transforms){
    const FBO = GPU.frameBuffers.get(STATIC_FRAMEBUFFERS.VISIBILITY_BUFFER)
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
    if(GizmoSystem.targetGizmo !== GizmoSystem.rotationGizmo) {
        GizmoSystem.toBufferShader.bindForUse({
            ...data,
            transformMatrix: GizmoSystem.mainEntity.__cacheCenterMatrix,
            uID: getPickerId(1)
        })
        GizmoSystem.screenSpaceMesh.draw()
    }

    DualAxisGizmo.drawToBuffer(data)
    FBO.stopMapping()
    VisibilityBuffer.needsUpdate = true
    gpu.enable(gpu.CULL_FACE)
}