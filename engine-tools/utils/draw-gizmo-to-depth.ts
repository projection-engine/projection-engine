import CameraAPI from "../../engine-core/lib/utils/CameraAPI";
import getPickerId from "../../engine-core/utils/get-picker-id";
import DualAxisGizmo from "../lib/transformation/DualAxisGizmo";
import GizmoSystem from "../runtime/GizmoSystem";
import VisibilityRenderer from "../../engine-core/runtime/rendering/VisibilityRenderer";
import GPU from "../../engine-core/GPU";
import STATIC_FRAMEBUFFERS from "../../engine-core/static/resources/STATIC_FRAMEBUFFERS";

export default function drawGizmoToDepth(mesh, transforms){
    const FBO = GPU.frameBuffers.get(STATIC_FRAMEBUFFERS.VISIBILITY_BUFFER)
    const data = {
        translation: GizmoSystem.mainEntity.__pivotOffset,
        cameraIsOrthographic: CameraAPI.isOrthographic
    }
    GPU.context.disable(GPU.context.CULL_FACE)
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
    VisibilityRenderer.needsUpdate = true
    GPU.context.enable(GPU.context.CULL_FACE)
}