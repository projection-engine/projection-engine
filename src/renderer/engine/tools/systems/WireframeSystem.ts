import GPUState from "@engine-core/states/GPUState"
import {mat4, vec3} from "gl-matrix"
import StaticMeshesState from "@engine-core/states/StaticMeshesState"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import StaticFBOState from "@engine-core/states/StaticFBOState"
import StaticEditorMeshes from "../utils/StaticEditorMeshes"
import EngineToolsState from "../EngineToolsState"
import GPUUtil from "../../core/utils/GPUUtil";
import AbstractSystem from "../../core/AbstractSystem";
import {ColliderTypes, Components,} from "@engine-core/engine.enum";
import EditorEntityManager from "../EditorEntityManager";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import PhysicsColliderComponent from "@engine-core/lib/components/PhysicsColliderComponent";
import EntityManager from "@engine-core/managers/EntityManager";
import CullingComponent from "@engine-core/lib/components/CullingComponent";

const EMPTY_MATRIX = mat4.create()
const translationCache = vec3.create()
export default class WireframeSystem extends AbstractSystem {
     shouldExecute = (): boolean =>  {
        return EngineToolsState.showOutline;
    }

     execute = () => {
        const uniforms = StaticEditorShaders.wireframeUniforms
        const context = GPUState.context

        StaticEditorShaders.wireframe.bind()
        GPUUtil.bind2DTextureForDrawing(uniforms.depth, 0, StaticFBOState.sceneDepthVelocity)


        let arr = EntityManager.withComponent(Components.DECAL).array
        let size = arr.length

        for (let i = 0; i < size; i++) {
            const entity = EditorEntityManager.getEntity(arr[i])
            const tComponent = entity.getComponent<TransformationComponent>(Components.TRANSFORMATION)
            const cullingComponent = entity.getComponent<CullingComponent>(Components.CULLING)
            if (!entity.active || cullingComponent.distanceFromCamera > EngineToolsState.maxDistanceIcon)
                continue

            context.uniformMatrix4fv(uniforms.transformMatrix, false, tComponent.matrix)
            context.uniform1i(uniforms.isSelected, entity.__isSelected ? 1 : 0)
            StaticEditorMeshes.clipSpaceCamera.drawLines()
        }

        arr = EntityManager.withComponent(Components.PHYSICS_COLLIDER).array
        size = arr.length
        for (let i = 0; i < size; i++) {
            const entity = EditorEntityManager.getEntity(arr[i])
            const tComponent = entity.getComponent<TransformationComponent>(Components.TRANSFORMATION)
            const cullingComponent = entity.getComponent<CullingComponent>(Components.CULLING)
            if (!entity.active || cullingComponent.distanceFromCamera > EngineToolsState.maxDistanceIcon) {
                continue
            }

            const collision = entity.getComponent<PhysicsColliderComponent>(Components.PHYSICS_COLLIDER)
            if (tComponent.changesApplied || !entity.__collisionTransformationMatrix) {
                entity.collisionUpdated = true
                const m = entity.__collisionTransformationMatrix || mat4.clone(EMPTY_MATRIX)
                vec3.add(translationCache, <vec3>collision.center, tComponent.absoluteTranslation)
                let scale
                const rotation = tComponent.rotationQuaternion
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
                    StaticMeshesState.sphere.draw()
                    break
                case ColliderTypes.BOX:
                    StaticEditorMeshes.clipSpaceCamera.drawLines()
                    break
            }
        }

    }
}
