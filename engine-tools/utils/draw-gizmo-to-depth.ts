import CameraAPI from "../../engine-core/lib/utils/CameraAPI";

import DualAxisGizmo from "../lib/transformation/DualAxisGizmo";
import GizmoSystem from "../runtime/GizmoSystem";
import VisibilityRenderer from "../../engine-core/runtime/VisibilityRenderer";
import GPU from "../../engine-core/GPU";
import StaticFBO from "../../engine-core/lib/StaticFBO";
import StaticEditorShaders from "../lib/StaticEditorShaders";
import StaticMeshes from "../../engine-core/lib/StaticMeshes";
import PickingAPI from "../../engine-core/lib/utils/PickingAPI";

export default function drawGizmoToDepth(mesh, transforms){
    const data = {
        translation: GizmoSystem.mainEntity.__pivotOffset,
        cameraIsOrthographic: CameraAPI.isOrthographic
    }
    StaticFBO.visibility.startMapping()
    GPU.context.disable(GPU.context.CULL_FACE)
    for (let i = 0; i < transforms.length; i++) {
        StaticEditorShaders.toDepthBuffer.bindForUse({
            ...data,
            transformMatrix: transforms[i],
            uID: PickingAPI.getPickerId(i + 2),
        })
        mesh.draw()
    }
    if(GizmoSystem.targetGizmo !== GizmoSystem.rotationGizmo) {
        StaticEditorShaders.toDepthBuffer.bindForUse({
            ...data,
            transformMatrix: GizmoSystem.mainEntity.__cacheCenterMatrix,
            uID: PickingAPI.getPickerId(1)
        })
        StaticMeshes.sphere.draw()
    }

    DualAxisGizmo.drawToBuffer(data)
    StaticFBO.visibility.stopMapping()
    VisibilityRenderer.needsUpdate = true
    GPU.context.enable(GPU.context.CULL_FACE)
}