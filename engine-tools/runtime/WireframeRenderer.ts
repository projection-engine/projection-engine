import GPU from "../../engine-core/GPU";
import COLLISION_TYPES from "../../engine-core/static/COLLISION_TYPES";
import {mat4, vec3} from "gl-matrix";
import StaticMeshes from "../../engine-core/lib/StaticMeshes";
import StaticEditorShaders from "../lib/StaticEditorShaders";
import Engine from "../../engine-core/Engine";

const EMPTY_MATRIX = mat4.create()
const translationCache = vec3.create()
export default class WireframeRenderer {
    static execute() {
        const entities = Engine.entities
        const size = entities.length
        const uniforms = StaticEditorShaders.wireframeUniforms
        const context = GPU.context

        StaticEditorShaders.wireframe.bind()
        for (let i = 0; i < size; i++) {
            const entity = entities[i]
            if (!entity.active)
                continue

            const collision = entity.physicsColliderComponent
            const decal = entity.decalComponent

            if(!decal && !collision)
                continue

            if (collision) {
                if (entity.changesApplied || !entity.__collisionTransformationMatrix) {
                    entity.collisionUpdated = true
                    const m = entity.__collisionTransformationMatrix || mat4.clone(EMPTY_MATRIX)
                    vec3.add(translationCache, <vec3>collision.center, entity.absoluteTranslation)
                    let scale
                    const rotation = entity._rotationQuat
                    if (collision.collisionType === COLLISION_TYPES.BOX)
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
                    case COLLISION_TYPES.SPHERE:
                        StaticMeshes.sphere.draw()
                        break
                    case COLLISION_TYPES.BOX:
                        StaticMeshes.cube.drawLines()
                        break
                }
            }else if(decal){
                context.uniformMatrix4fv(uniforms.transformMatrix, false, entity.matrix)
                StaticMeshes.cube.drawLineLoop()
            }
        }
    }
}