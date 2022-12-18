import {mat4, quat, vec3} from "gl-matrix"
import TRANSFORMATION_TYPE from "../../frontend/editor/static/TRANSFORMATION_TYPE"
import GizmoSystem from "../runtime/GizmoSystem";
import CameraAPI from "../../engine-core/lib/utils/CameraAPI";
import GPU from "../../engine-core/GPU";
import STATIC_SHADERS from "../../engine-core/static/resources/STATIC_SHADERS";
import Shader from "../../engine-core/instances/Shader";
import Controller from "../../engine-core/lib/Controller";
import Entity from "../../engine-core/instances/Entity";

let shader: Shader, uniforms: { [key: string]: WebGLUniformLocation }
const cacheVec3 = vec3.create()
const cacheQuat = quat.create()
export default class GizmoAPI extends Controller {
    static initialize() {
        super.initialize()
        shader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.GIZMO)
        uniforms = shader.uniformMap
    }
    static translateMatrix(entity:Entity, keepMatrix:Boolean): Float32Array {
        if (!GizmoSystem.mainEntity)
            return
        const matrix = keepMatrix ? entity.matrix : <Float32Array>mat4.copy(mat4.create(), entity.matrix)
        GizmoAPI.applyTransformation(matrix, entity._rotationQuat, entity._translation, entity._scaling)
        return matrix
    }

    static applyTransformation(matrix: Float32Array, quaternion: Float32Array, translation: Float32Array, scale: Float32Array): void {
        const m = GizmoSystem.mainEntity
        if (!m)
            return
        const isRelative = GizmoSystem.transformationType === TRANSFORMATION_TYPE.RELATIVE
        if (isRelative || m.parent) {
            const quatToMultiply = isRelative ? GizmoSystem.targetRotation : m.parent._rotationQuat
            if (!quatToMultiply)
                return;
            vec3.add(cacheVec3, m.__pivotOffset, translation)
            quat.multiply(cacheQuat, quatToMultiply, quaternion)
            mat4.fromRotationTranslationScaleOrigin(
                matrix,
                cacheQuat,
                cacheVec3,
                scale,
                translation
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
        GPU.context.uniformMatrix4fv(uniforms.transformMatrix, false, transformMatrix)
        GPU.context.uniform3fv(uniforms.translation, GizmoSystem.mainEntity.__pivotOffset)
        GPU.context.uniform1i(uniforms.axis, axis)
        GPU.context.uniform1i(uniforms.selectedAxis, clickedAxis)
        GPU.context.uniform1i(uniforms.cameraIsOrthographic, CameraAPI.notificationBuffers[2])
        mesh.simplifiedDraw()
    }
}
