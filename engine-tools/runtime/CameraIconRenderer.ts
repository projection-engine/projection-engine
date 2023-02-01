import StaticEditorMeshes from "../lib/StaticEditorMeshes";
import StaticEditorShaders from "../lib/StaticEditorShaders";
import GPU from "../../engine-core/GPU";
import {glMatrix, mat4} from "gl-matrix";
import CameraAPI from "../../engine-core/lib/utils/CameraAPI";
import Entity from "../../engine-core/instances/Entity";


const invView = mat4.create()
const projection = mat4.create()
const view = mat4.create()
export default class CameraIconRenderer {
    static #createFrustumMatrix(entity:Entity){
        const component = entity.cameraComponent
        if (entity.changesApplied || !entity.__cameraIconMatrix || entity.__cameraNeedsUpdate) {
            entity.__cameraNeedsUpdate = false
            const t = entity._translation
            const q = entity._rotationQuat
            const aR = component.dynamicAspectRatio ? CameraAPI.aspectRatio : component.aspectRatio
            if (component.ortho)
                mat4.ortho(projection, -component.size, component.size, -component.size / aR, component.size / aR, -component.zNear, component.zFar)
            else
                mat4.perspective(projection, glMatrix.toRadian(component.fov), aR, component.zNear, component.zFar)
            if (!entity.__cameraIconMatrix)
                entity.__cameraIconMatrix = mat4.create()
            mat4.fromRotationTranslation(invView, q, t)
            mat4.invert(view, invView)
            mat4.multiply(entity.__cameraIconMatrix, projection, view)
            mat4.invert(entity.__cameraIconMatrix, entity.__cameraIconMatrix)
            console.log("UPDATING")
        }
    }
    static execute(entity: Entity) {

        const context = GPU.context
        const uniforms = StaticEditorShaders.wireframeUniforms

        context.uniformMatrix4fv(uniforms.transformMatrix, false, entity.matrix)
        context.uniform1i(uniforms.isSelected, entity.__isSelected ? 1 : 0)
        StaticEditorMeshes.camera.drawLines()

        // context.uniformMatrix4fv(uniforms.transformMatrix, false, entity.__cameraIconMatrix)
        // StaticEditorMeshes.clipSpaceCamera.drawLines()

    }
}