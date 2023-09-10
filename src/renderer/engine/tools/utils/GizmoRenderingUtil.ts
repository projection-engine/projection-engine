import StaticEditorFBO from "../state/StaticEditorFBO";
import GizmoState from "../state/GizmoState";
import StaticEditorShaders from "../state/StaticEditorShaders";
import CameraManager from "@engine-core/managers/CameraManager";
import GPUState from "@engine-core/states/GPUState";
import Mesh from "@engine-core/lib/resources/Mesh";
import {mat4, vec3} from "gl-matrix";
import GPUUtil from "@engine-core/utils/GPUUtil";
import EngineToolsState from "../state/EngineToolsState";
import CameraState from "@engine-core/states/CameraState";
import AXIS from "../static/AXIS";

export default class GizmoRenderingUtil{
    static drawGizmo(mesh: Mesh, transformMatrix: mat4, axis: AXIS) {
        StaticEditorShaders.gizmo.bind()
        const uniforms = StaticEditorShaders.gizmoUniforms
        GPUUtil.bind2DTextureForDrawing(uniforms.gizmoIDS, 0, StaticEditorFBO.gizmo.colors[0])
        GPUState.context.uniform2fv(uniforms.mouseCoordinates, EngineToolsState.mouseCoordinates)

        GPUState.context.uniformMatrix4fv(uniforms.transformMatrix, false, transformMatrix)
        GPUState.context.uniform3fv(uniforms.translation, GizmoState.mainEntity.__pivotOffset)
        GPUState.context.uniform1i(uniforms.axis, axis)
        GPUState.context.uniform1i(uniforms.selectedAxis, GizmoState.clickedAxis)
        GPUState.context.uniform1i(uniforms.cameraIsOrthographic, CameraState.notificationBuffers[2])
        mesh.simplifiedDraw()
    }

    static drawGizmoToDepth() {
        const data = {
            translation: GizmoState.mainEntity.__pivotOffset,
            cameraIsOrthographic: CameraManager.isOrthographic
        }
        StaticEditorFBO.gizmo.startMapping()
        StaticEditorShaders.toDepthBuffer.bind()
        for (let i = 0; i < GizmoState.targetGizmos.length; i++) {
            GizmoState.targetGizmos[i].drawToDepth(data)
        }
        StaticEditorFBO.gizmo.stopMapping()
    }

    static drawToDepth(data: MutableObject, mesh: Mesh, transformation: mat4, pickId: vec3) {
        const uniformMap = StaticEditorShaders.toDepthBuffer.uniformMap

        GPUState.context.uniformMatrix4fv(uniformMap.transformMatrix, false, transformation)
        GPUState.context.uniform1i(uniformMap.cameraIsOrthographic, data.cameraIsOrthographic)
        GPUState.context.uniform3fv(uniformMap.uID, pickId)
        GPUState.context.uniform3fv(uniformMap.translation, data.translation)

        mesh.draw()
    }
}
