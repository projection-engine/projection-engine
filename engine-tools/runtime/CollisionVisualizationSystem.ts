import STATIC_MESHES from "../../engine-core/static/resources/STATIC_MESHES";
import GPU from "../../engine-core/lib/GPU";
import COMPONENTS from "../../engine-core/static/COMPONENTS.js";
import COLLISION_TYPES from "../../engine-core/static/COLLISION_TYPES";
import {mat4, vec3} from "gl-matrix";
import Controller from "../../engine-core/lib/Controller";
import RigidBodyComponent from "../../engine-core/templates/components/RigidBodyComponent";
import PhysicsColliderComponent from "../../engine-core/templates/components/PhysicsColliderComponent";

const EMPTY_MATRIX = mat4.create()

let shader, uniforms
const translationCache = vec3.create()
export default class CollisionVisualizationSystem extends Controller{
    static cube
    static sphere
    static shader

    static initialize() {
        shader = CollisionVisualizationSystem.shader
        uniforms = shader.uniformMap
        CollisionVisualizationSystem.cube = GPU.meshes.get(STATIC_MESHES.PRODUCTION.CUBE)
        CollisionVisualizationSystem.sphere = GPU.meshes.get(STATIC_MESHES.PRODUCTION.SPHERE)

    }

    static execute(selected) {
        const size = selected.length
        if (size === 0)
            return
        shader.bind()
        for (let i = 0; i < size; i++) {
            const entity = selected[i]
            if (!entity.active)
                continue
            const collision = <PhysicsColliderComponent>entity.components.get(COMPONENTS.PHYSICS_COLLIDER)

            if (!collision)
                continue
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

            gpu.uniformMatrix4fv(uniforms.transformMatrix, false, entity.__collisionTransformationMatrix)
            switch (collision.collisionType) {
                case COLLISION_TYPES.SPHERE:
                    CollisionVisualizationSystem.sphere.draw()
                    break
                case COLLISION_TYPES.BOX:
                    CollisionVisualizationSystem.cube.drawLines()
                    break
            }
        }
    }
}