import StaticEditorMeshes from "../lib/StaticEditorMeshes"
import StaticEditorShaders from "../lib/StaticEditorShaders"
import GPU from "../../GPU"
import {mat4} from "gl-matrix"
import Entity from "../../instances/Entity"


const invView = mat4.create()
const projection = mat4.create()
const view = mat4.create()
export default class CameraIconRenderer {
	static #createFrustumMatrix(entity: Entity) {
		if (entity.changesApplied || !entity.__cameraIconMatrix || entity.__cameraNeedsUpdate) {
			entity.__cameraNeedsUpdate = false
			const t = entity._translation
			const q = entity._rotationQuaternion


			mat4.perspective(projection, Math.PI / 4, 1.3, .5, 3)
			if (!entity.__cameraIconMatrix)
				entity.__cameraIconMatrix = mat4.create()
			mat4.fromRotationTranslation(invView, q, t)
			mat4.invert(view, invView)
			mat4.multiply(entity.__cameraIconMatrix, projection, view)
			mat4.invert(entity.__cameraIconMatrix, entity.__cameraIconMatrix)
		}
	}

	static execute(settings, entity: Entity) {
		if (entity.distanceFromCamera > settings.maxDistanceIcon)
			return
		CameraIconRenderer.#createFrustumMatrix(entity)
		const context = GPU.context
		const uniforms = StaticEditorShaders.wireframeUniforms

		context.uniform1i(uniforms.isSelected, entity.__isSelected ? 1 : 0)
		context.uniformMatrix4fv(uniforms.transformMatrix, false, entity.__cameraIconMatrix)
		StaticEditorMeshes.clipSpaceCamera.drawLines()

	}
}