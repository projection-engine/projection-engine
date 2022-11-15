import GizmoSystem from "../runtime/GizmoSystem";
import {mat4} from "gl-matrix";
import getPivotPointTranslation from "./get-pivot-point-translation";

const EMPTY_MATRIX = mat4.create()
export default function getPivotPointMatrix(entity) {
    if (entity.__changedBuffer[1] || !entity.__cacheCenterMatrix || entity.__pivotChanged) {
        console.log("UPDATING MATRIX")
        const m = !entity.__cacheCenterMatrix ? mat4.clone(EMPTY_MATRIX) : entity.__cacheCenterMatrix
        getPivotPointTranslation(entity)
        mat4.fromRotationTranslationScale(m, entity._rotationQuat, entity.__pivotOffset, [.25, .25, .25])
        entity.__cacheCenterMatrix = m


        GizmoSystem.targetGizmo.transformGizmo()
        entity.__pivotChanged = false
    }
}