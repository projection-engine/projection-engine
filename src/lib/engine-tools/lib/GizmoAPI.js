import {mat4, quat, vec3} from "gl-matrix"
import TRANSFORMATION_TYPE from "../../../static/TRANSFORMATION_TYPE"

import GizmoSystem from "../runtime/GizmoSystem";
import CameraAPI from "../../../../public/engine/lib/utils/CameraAPI";

export default class GizmoAPI {
    static tooltip

    static translateMatrix(entity, keepMatrix) {
        if (!GizmoSystem.translation)
            return
        const matrix = keepMatrix ? entity.matrix : mat4.copy([], entity.matrix)
        GizmoAPI.applyTransformation(matrix, entity._rotationQuat, entity._translation, entity._scaling)

        return matrix
    }

    static applyTransformation(matrix, q, t, s) {
        const m = GizmoSystem.mainEntity
        const isRelative = GizmoSystem.transformationType === TRANSFORMATION_TYPE.RELATIVE
        if (isRelative || m.parent)
            mat4.fromRotationTranslationScaleOrigin(
                matrix,
                quat.multiply([], isRelative ? GizmoSystem.targetRotation : m.parent._rotationQuat, q),
                vec3.add([], GizmoSystem.mainEntity.pivotPoint, t),
                s,
                t
            )
        else {
            matrix[12] += GizmoSystem.mainEntity.pivotPoint[0]
            matrix[13] += GizmoSystem.mainEntity.pivotPoint[1]
            matrix[14] += GizmoSystem.mainEntity.pivotPoint[2]
        }
    }

    static drawGizmo(mesh, transformMatrix, axis, uID) {
        GizmoSystem.gizmoShader.bindForUse({
            transformMatrix,
            translation: GizmoSystem.mainEntity.pivotPoint,
            axis,
            selectedAxis: GizmoSystem.clickedAxis,
            uID,
            cameraIsOrthographic: CameraAPI.isOrthographic
        })
        mesh.draw()
    }
}
