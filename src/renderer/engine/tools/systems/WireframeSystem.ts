import GPU from "../../core/GPU"
import {mat4, vec3} from "gl-matrix"
import StaticMeshes from "../../core/lib/StaticMeshes"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import StaticFBO from "../../core/lib/StaticFBO"
import StaticEditorMeshes from "../utils/StaticEditorMeshes"
import EngineToolsState from "../EngineToolsState"
import GPUUtil from "../../core/utils/GPUUtil";
import AbstractSystem from "../../core/AbstractSystem";
import CameraComponent from "../../core/components/CameraComponent";
import DynamicMap from "../../core/resource-libs/DynamicMap";
import {UUID} from "crypto";
import Entity from "../../core/instances/Entity";
import ResourceEntityMapper from "../../core/resource-libs/ResourceEntityMapper";

const EMPTY_MATRIX = mat4.create()
const translationCache = vec3.create()
export default class WireframeSystem extends AbstractSystem {


    @AbstractSystem.injectComponents(CameraComponent.componentKey)
    colliders: DynamicMap<UUID, Entity>

    shouldExecute(): boolean {
        return EngineToolsState.showOutline;
    }

    execute() {
        const uniforms = StaticEditorShaders.wireframeUniforms
        const context = GPU.context

        StaticEditorShaders.wireframe.bind()
        GPUUtil.bind2DTextureForDrawing(uniforms.depth, 0, StaticFBO.sceneDepthVelocity)

        let size = ResourceEntityMapper.decals.size
        let arr = ResourceEntityMapper.decals.array
        for(let i = 0; i < size; i++){
            const entity = arr[i]
            if (!entity.active || entity.distanceFromCamera > EngineToolsState.maxDistanceIcon)
                continue

            context.uniformMatrix4fv(uniforms.transformMatrix, false, entity.matrix)
            context.uniform1i(uniforms.isSelected, entity.__isSelected ? 1 : 0)
            StaticEditorMeshes.clipSpaceCamera.drawLines()
        }

        size = this.colliders.size
        arr = this.colliders.array
        for(let i = 0; i < size; i++){
            const entity = arr[i]
            if (!entity.active || entity.distanceFromCamera > EngineToolsState.maxDistanceIcon)
                continue

            const collision = entity.physicsColliderComponent
            if (entity.changesApplied || !entity.__collisionTransformationMatrix) {
                entity.collisionUpdated = true
                const m = entity.__collisionTransformationMatrix || mat4.clone(EMPTY_MATRIX)
                vec3.add(translationCache, <vec3>collision.center, entity.absoluteTranslation)
                let scale
                const rotation = entity._rotationQuaternion
                if (collision.collisionType === ColliderTypes.BOX)
                    scale = collision.size
                else {
                    const r = collision.radius
                    scale = [r, r, r]
                }
                mat4.fromRotationTranslationScale(m, rotation, translationCache, scale)
                entity.__collisionTransformationMatrix = m
            }

            context.uniformMatrix4fv(uniforms.transformMatrix, false, entity.__collisionTransformationMatrix)
            switch (collision.collisionType) {
                case ColliderTypes.SPHERE:
                    StaticMeshes.sphere.draw()
                    break
                case ColliderTypes.BOX:
                    StaticEditorMeshes.clipSpaceCamera.drawLines()
                    break
            }
        }

    }
}
