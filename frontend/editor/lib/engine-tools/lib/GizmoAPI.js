import {mat4, quat, vec3} from "gl-matrix"
import TRANSFORMATION_TYPE from "../../../static/TRANSFORMATION_TYPE"

import GizmoSystem from "../runtime/GizmoSystem";
import CameraAPI from "../../../../../public/engine/lib/utils/CameraAPI";
import AXIS from "../static/AXIS";
import VisibilityRenderer from "../../../../../public/engine/runtime/rendering/VisibilityRenderer";
import LineRenderer from "../runtime/LineRenderer";

export default class GizmoAPI {
    static tooltip

    static translateMatrix(entity, keepMatrix) {
        if (!GizmoSystem.mainEntity)
            return
        const matrix = keepMatrix ? entity.matrix : mat4.copy([], entity.matrix)
        GizmoAPI.applyTransformation(matrix, entity._rotationQuat, entity._translation, entity._scaling)

        return matrix
    }

    static applyTransformation(matrix, q, t, s) {
        const m = GizmoSystem.mainEntity
        if (!m)
            return
        const isRelative = GizmoSystem.transformationType === TRANSFORMATION_TYPE.RELATIVE
        if (isRelative || m.parent) {
            const quatToMultiply = isRelative ? GizmoSystem.targetRotation : m.parent._rotationQuat
            if (!quatToMultiply)
                return;
            mat4.fromRotationTranslationScaleOrigin(
                matrix,
                quat.multiply([], quatToMultiply, q),
                vec3.add([], m.__pivotOffset, t),
                s,
                t
            )
        } else {
            matrix[12] += m.__pivotOffset[0]
            matrix[13] += m.__pivotOffset[1]
            matrix[14] += m.__pivotOffset[2]
        }
    }

    static drawGizmo(mesh, transformMatrix, axis, uID) {
        const a = GizmoSystem.clickedAxis

        // TODO - REPLACE WITH BETTER STRUCTURE
        GizmoSystem.gizmoShader.bindForUse({
            transformMatrix,
            translation: GizmoSystem.mainEntity.__pivotOffset,
            axis,
            selectedAxis: a === AXIS.SCREEN_SPACE ? axis : a,
            uID,
            cameraIsOrthographic: CameraAPI.isOrthographic,
            depthSampler: VisibilityRenderer.depthSampler,
            bufferResolution: LineRenderer.depthBufferResolution
        })
        mesh.simplifiedDraw()
    }
}
