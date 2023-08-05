import StaticEditorMeshes from "../utils/StaticEditorMeshes"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import GPU from "../../core/GPU"
import {mat4} from "gl-matrix"
import Entity from "../../core/instances/Entity"
import EngineToolsState from "../EngineToolsState"
import AbstractSystem from "../../core/AbstractSystem";
import DynamicMap from "../../core/resource-libs/DynamicMap";
import {UUID} from "crypto";
import CameraComponent from "../../core/instances/components/CameraComponent";
import GPUUtil from "../../core/utils/GPUUtil";
import StaticFBO from "../../core/lib/StaticFBO";

export default class CameraIconSystem extends AbstractSystem {
    static #invView = mat4.create()
    static #projection = mat4.create()
    static #view = mat4.create()

    @AbstractSystem.injectComponents(CameraComponent.componentKey)
    cameras: DynamicMap<UUID, Entity>

    #createFrustumMatrix(entity: Entity) {
        if (entity.changesApplied || !entity.__cameraIconMatrix || entity.__cameraNeedsUpdate) {
            entity.__cameraNeedsUpdate = false
            const t = entity._translation
            const q = entity._rotationQuaternion


            mat4.perspective(CameraIconSystem.#projection, Math.PI / 4, 1.3, .5, 3)
            if (!entity.__cameraIconMatrix)
                entity.__cameraIconMatrix = mat4.create()
            mat4.fromRotationTranslation(CameraIconSystem.#invView, q, t)
            mat4.invert(CameraIconSystem.#view, CameraIconSystem.#invView)
            mat4.multiply(entity.__cameraIconMatrix, CameraIconSystem.#projection, CameraIconSystem.#view)
            mat4.invert(entity.__cameraIconMatrix, entity.__cameraIconMatrix)
        }
    }

    shouldExecute(): boolean {
        return this.cameras.size > 0;
    }

    execute() {
        const uniforms = StaticEditorShaders.wireframeUniforms
        const context = GPU.context
        const size = this.cameras.size
        const arr = this.cameras.array
        StaticEditorShaders.wireframe.bind()
        GPUUtil.bind2DTextureForDrawing(uniforms.depth, 0, StaticFBO.sceneDepthVelocity)
        for (let i = 0; i < size; i++) {
            const entity = arr[i]
            if (entity.distanceFromCamera > EngineToolsState.maxDistanceIcon)
                continue
            this.#createFrustumMatrix(entity)

            context.uniform1i(uniforms.isSelected, entity.__isSelected ? 1 : 0)
            context.uniformMatrix4fv(uniforms.transformMatrix, false, entity.__cameraIconMatrix)
            StaticEditorMeshes.clipSpaceCamera.drawLines()
        }
    }
}
