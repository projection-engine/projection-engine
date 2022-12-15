import {mat4, quat, vec3} from "gl-matrix"
import TRANSFORMATION_TYPE from "../../frontend/editor/static/TRANSFORMATION_TYPE"

import GizmoSystem from "../runtime/GizmoSystem";
import CameraAPI from "../../engine-core/lib/utils/CameraAPI";
import GPU from "../../engine-core/GPU";
import STATIC_SHADERS from "../../engine-core/static/resources/STATIC_SHADERS";

let shader, uniforms
export default class GizmoAPI {

    static initialize(){
        shader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.GIZMO)
        uniforms = shader.uniformMap
    }

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

    static drawGizmo(mesh, transformMatrix, axis) {
        const clickedAxis = GizmoSystem.clickedAxis
        shader.bind()
        gpu.uniformMatrix4fv(uniforms.transformMatrix, false, transformMatrix)
        gpu.uniform3fv(uniforms.translation, GizmoSystem.mainEntity.__pivotOffset)
        gpu.uniform1i(uniforms.axis, axis)
        gpu.uniform1i(uniforms.selectedAxis, clickedAxis)

        gpu.uniform1i(uniforms.cameraIsOrthographic, CameraAPI.notificationBuffers[2])


        mesh.simplifiedDraw()
    }
}
