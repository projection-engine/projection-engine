import GPU from "../../GPU"
import COLLISION_TYPES from "../../static/COLLISION_TYPES"
import {mat4, vec3} from "gl-matrix"
import StaticMeshes from "../../lib/StaticMeshes"
import StaticEditorShaders from "../lib/StaticEditorShaders"
import Engine from "../../Engine"
import StaticFBO from "../../lib/StaticFBO"
import StaticEditorMeshes from "../lib/StaticEditorMeshes"
import ResourceEntityMapper from "../../resource-libs/ResourceEntityMapper"
import CameraIconRenderer from "./CameraIconRenderer"

const EMPTY_MATRIX = mat4.create()
const translationCache = vec3.create()
export default class WireframeRenderer {
	static execute(settings) {
		const entities = Engine.entities.array
		const size = entities.length
		const uniforms = StaticEditorShaders.wireframeUniforms
		const context = GPU.context

		StaticEditorShaders.wireframe.bind()

		context.activeTexture(context.TEXTURE0)
		context.bindTexture(context.TEXTURE_2D, StaticFBO.sceneDepthVelocity)
		context.uniform1i(uniforms.depth, 0)

		const cameras = ResourceEntityMapper.cameras.array
		const camerasSize = cameras.length
		for (let i = 0; i < camerasSize; i++)
			CameraIconRenderer.execute(settings, cameras[i])


		for (let i = 0; i < size; i++) {
			const entity = entities[i]
			if (!entity.active || entity.distanceFromCamera > settings.maxDistanceIcon)
				continue

			const collision = entity.physicsColliderComponent
			const decal = entity.decalComponent

			if (!decal && !collision)
				continue


			if (collision) {
				if (entity.changesApplied || !entity.__collisionTransformationMatrix) {
					entity.collisionUpdated = true
					const m = entity.__collisionTransformationMatrix || mat4.clone(EMPTY_MATRIX)
					vec3.add(translationCache, <vec3>collision.center, entity.absoluteTranslation)
					let scale
					const rotation = entity._rotationQuaternion
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
					StaticEditorMeshes.clipSpaceCamera.drawLines()
					break
				}
			} else if (decal) {

				context.uniformMatrix4fv(uniforms.transformMatrix, false, entity.matrix)
				context.uniform1i(uniforms.isSelected, entity.__isSelected ? 1 : 0)
				StaticEditorMeshes.clipSpaceCamera.drawLines()

			}
		}
	}
}