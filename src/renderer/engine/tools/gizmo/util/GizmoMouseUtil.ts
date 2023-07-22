import PickingAPI from "../../../core/lib/utils/PickingAPI"
import GPU from "../../../core/GPU"
import CameraAPI from "../../../core/lib/utils/CameraAPI"
import AXIS from "../../static/AXIS"
import VisibilityRenderer from "../../../core/runtime/VisibilityRenderer"
import StaticEditorShaders from "../../utils/StaticEditorShaders"
import GizmoState from "./GizmoState"
import GizmoSystem from "../GizmoSystem"
import GizmoUtil from "./GizmoUtil"
import {vec3} from "gl-matrix"
import ConversionAPI from "../../../core/lib/math/ConversionAPI";
import StaticEditorFBO from "../../utils/StaticEditorFBO";

export default class GizmoMouseUtil {

    static onMouseUp() {
        GizmoState.hasTransformationStarted = false
        // document.exitPointerLock()
        GizmoState.clickedAxis = AXIS.NONE
        if (!GizmoState.mainEntity)
            return
        GizmoUtil.updateGizmosTransformation(true)
        GizmoSystem.callListeners()
        GizmoSystem.onStop?.()
        GizmoState.initialEntityPosition[0] = 0
        GizmoState.initialEntityPosition[1] = 0
        GizmoState.initialEntityPosition[2] = 0
    }

    static onMouseDown(event: MouseEvent) {
        if (!GizmoState.mainEntity)
            return
        GizmoUtil.updateGizmosTransformation(true)
        const axis = PickingAPI.readEntityID(event.clientX, event.clientY, 0, StaticEditorFBO.gizmo.FBO)
        if (axis === 0)
            return
        vec3.copy(GizmoState.initialEntityPosition, GizmoState.mainEntity.__pivotOffset)
        GizmoSystem.callListeners(false)
        GizmoState.wasOnGizmo = true
        GizmoState.clickedAxis = axis
        GizmoSystem.onStart?.()
    }


    static onMouseMove(event: MouseEvent) {
        if (GizmoState.targetGizmos.length === 0)
            return
        const coords = ConversionAPI.toQuadCoordinates(event.clientX, event.clientY, GPU.internalResolution.w, GPU.internalResolution.h)
        GizmoState.mouseCoordinates[0] = coords.x
        GizmoState.mouseCoordinates[1] = coords.y
        for (let i = 0; i < GizmoState.targetGizmos.length; i++) {
            GizmoState.targetGizmos[i].onMouseMove(event)
        }
    }
}
