import PickingUtil from "@engine-core/utils/PickingUtil"
import AXIS from "../static/AXIS"
import Axis from "../static/AXIS"
import GizmoState from "../state/GizmoState"
import GizmoSystem from "../systems/GizmoSystem"
import GizmoUtil from "./GizmoUtil"
import {vec3} from "gl-matrix"
import StaticEditorFBO from "../state/StaticEditorFBO";

export default class GizmoMouseUtil {
    static #RIGHT_BUTTON = 2;

    static onMouseUp(event: MouseEvent) {
        if(event.button === GizmoMouseUtil.#RIGHT_BUTTON)
        GizmoState.hasTransformationStarted = false
        // document.exitPointerLock()
        GizmoState.clickedAxis = AXIS.NONE
        if (!GizmoState.mainEntity)
            return
        GizmoUtil.updateGizmosTransformation(true)
        GizmoState.callListeners()
        GizmoSystem.onStop?.()
        GizmoState.initialEntityPosition[0] = 0
        GizmoState.initialEntityPosition[1] = 0
        GizmoState.initialEntityPosition[2] = 0
    }

    static onMouseDown(event: MouseEvent) {
        if (!GizmoState.mainEntity)
            return
        GizmoUtil.updateGizmosTransformation(true)
        const axis = PickingUtil.readEntityID(event.clientX, event.clientY, 0, StaticEditorFBO.gizmo.FBO)
        if (axis === 0)
            return
        vec3.copy(GizmoState.initialEntityPosition, GizmoState.mainEntity.__pivotOffset)
        GizmoState.callListeners(false)
        GizmoState.wasOnGizmo = true
        GizmoState.clickedAxis = axis
        GizmoSystem.onStart?.()
    }


    static onMouseMove(event: MouseEvent) {
        if(GizmoState.clickedAxis == Axis.NONE)
            return;
        for (let i = 0; i < GizmoState.targetGizmos.length; i++) {
            GizmoState.targetGizmos[i].onMouseMove(event)
        }
    }
}
