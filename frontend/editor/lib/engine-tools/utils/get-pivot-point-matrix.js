import GizmoSystem from "../runtime/GizmoSystem";
import {mat4} from "gl-matrix";
import getPivotPointTranslation from "./get-pivot-point-translation";

const EMPTY_MATRIX = mat4.create()
export default function getPivotPointMatrix(entity) {
    if (entity.__changedBuffer[1] || !entity.__cacheCenterMatrix || entity.__pivotChanged) {
        const m = !entity.__cacheCenterMatrix ? mat4.clone(EMPTY_MATRIX) : entity.__cacheCenterMatrix
        getPivotPointTranslation(entity)

        mat4.fromRotationTranslationScale(m, entity._rotationQuat, entity.__pivotOffset, [.25, .25, .25])
        entity.__cacheCenterMatrix = m
        if(!entity.__cacheIconMatrix)
            entity.__cacheIconMatrix = mat4.create()
        mat4.copy(entity.__cacheIconMatrix, entity.__cacheCenterMatrix)

        entity.__cacheIconMatrix[12] = entity.absoluteTranslation[0]
        entity.__cacheIconMatrix[13] = entity.absoluteTranslation[1]
        entity.__cacheIconMatrix[14] = entity.absoluteTranslation[2]

        if(GizmoSystem.mainEntity) {
            GizmoSystem.targetGizmo.transformGizmo()
            GizmoSystem.updateGizmoToolTip()
        }
        entity.__pivotChanged = false
    }
}