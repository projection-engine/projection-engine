import {glMatrix, vec3} from "gl-matrix"
import AXIS from "../static/AXIS"
import GPUState from "@engine-core/states/GPUState"
import StaticEditorMeshes from "../state/StaticEditorMeshes"
import StaticEditorShaders from "../state/StaticEditorShaders"
import GizmoUtil from "../utils/GizmoUtil"
import GizmoState from "../state/GizmoState"
import AbstractXYZGizmo from "./AbstractXYZGizmo";
import GPUUtil from "@engine-core/utils/GPUUtil";
import StaticEditorFBO from "../state/StaticEditorFBO";
import EngineToolsState from "../state/EngineToolsState";
import CameraState from "@engine-core/states/CameraState";
import GizmoManager from "../managers/GizmoManager";

const uniformCache = new Float32Array(4)
export default class RotationGizmo extends AbstractXYZGizmo {

    constructor() {
        super()
        this.mesh = StaticEditorMeshes.rotationGizmo
        this.xGizmo = RotationGizmo.#mapGizmoMesh("x", 2)
        this.yGizmo = RotationGizmo.#mapGizmoMesh("y", 3)
        this.zGizmo = RotationGizmo.#mapGizmoMesh("z", 4)
    }

    static #mapGizmoMesh(axis: string, index: number) {
        let rotation = vec3.create()
        const scale = vec3.fromValues(1.5, .1, 1.5)
        switch (axis) {
            case "x":
                rotation = vec3.fromValues(0, 0, Math.PI / 2)
                break
            case "z":
                rotation = vec3.fromValues(Math.PI / 2, 0, 0)
                break
        }
        return GizmoUtil.getGizmoEntity(index, rotation, scale)
    }

    clearState() {
        GizmoManager.getCurrentRotation().fill(0)
        GizmoManager.setCurrentIncrement(0)
    }

    drawGizmo() {
        if (!GizmoState.mainEntity)
            return
        this.#draw(this.xGizmo.matrix, AXIS.X)
        this.#draw(this.yGizmo.matrix, AXIS.Y)
        this.#draw(this.zGizmo.matrix, AXIS.Z)
    }

    #draw(transformMatrix, axis) {
        if (GizmoState.clickedAxis === axis || GizmoState.clickedAxis === AXIS.NONE) {
            StaticEditorShaders.rotation.bind()
            const uniforms = StaticEditorShaders.rotationUniforms
            const context = GPUState.context

            context.uniformMatrix4fv(uniforms.transformMatrix, false, transformMatrix)
            context.uniform3fv(uniforms.translation, GizmoState.mainEntity.__pivotOffset)
            context.uniform1i(uniforms.cameraIsOrthographic, CameraState.notificationBuffers[2])

            GPUUtil.bind2DTextureForDrawing(uniforms.gizmoIDS, 0, StaticEditorFBO.gizmo.colors[0])
            GPUState.context.uniform2fv(uniforms.mouseCoordinates, EngineToolsState.mouseCoordinates)

            uniformCache[0] = axis
            uniformCache[1] = GizmoState.clickedAxis
            uniformCache[2] = GizmoManager.getCurrentRotation()[axis - 2]
            uniformCache[3] = glMatrix.toRadian(GizmoState.rotationGridSize)
            context.uniform4fv(uniforms.metadata, uniformCache)

            this.mesh.draw()
        }
    }

    onMouseMove(event: MouseEvent) {
        GizmoManager.rotate(event.movementX, event.ctrlKey)
        GizmoState.callListeners()
    }
}
