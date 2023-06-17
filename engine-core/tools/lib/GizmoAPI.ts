import {mat4, quat, vec3} from "gl-matrix"
import TRANSFORMATION_TYPE from "../../../frontend/window-editor/static/TRANSFORMATION_TYPE"
import GizmoSystem from "../runtime/GizmoSystem"
import CameraAPI from "../../lib/utils/CameraAPI"
import GPU from "../../GPU"
import Entity from "../../instances/Entity"
import StaticEditorShaders from "./StaticEditorShaders"
import AXIS from "../static/AXIS"
import EngineTools from "../EngineTools"

const cacheVec3 = vec3.create()
const cacheQuat = quat.create()

export default class GizmoAPI {
	static get isGlobal() {
		return AXIS.SCREEN_SPACE === GizmoSystem.clickedAxis || GizmoSystem.transformationType === TRANSFORMATION_TYPE.GLOBAL || EngineTools.selected.length > 1
	}

	static translateMatrix(entity: Entity) {
		GizmoAPI.applyTransformation(entity.matrix, entity.rotationQuaternion, entity.translation, entity.scaling)
	}

	static applyTransformation(matrix: Float32Array, quaternion: Float32Array, translation: Float32Array, scale: Float32Array): void {
		const m = GizmoSystem.mainEntity
		if (!m)
			return
		const isRelative = !GizmoAPI.isGlobal
		if (isRelative || m.parent) {
			const quatToMultiply = isRelative ? GizmoSystem.targetRotation : m.parent.rotationQuaternionFinal
			if (!quatToMultiply)
				return
			vec3.add(cacheVec3, m.__pivotOffset, translation)
			quat.multiply(cacheQuat, quatToMultiply, quaternion)
			mat4.fromRotationTranslationScaleOrigin(
				matrix,
				cacheQuat,
				cacheVec3,
				scale,
				translation
			)
		} else {
			matrix[12] += m.__pivotOffset[0]
			matrix[13] += m.__pivotOffset[1]
			matrix[14] += m.__pivotOffset[2]
		}
	}

	static drawGizmo(mesh, transformMatrix, axis) {
		const clickedAxis = GizmoSystem.clickedAxis
		StaticEditorShaders.gizmo.bind()
		const uniforms = StaticEditorShaders.gizmoUniforms
		GPU.context.uniformMatrix4fv(uniforms.transformMatrix, false, transformMatrix)
		GPU.context.uniform3fv(uniforms.translation, GizmoSystem.mainEntity.__pivotOffset)
		GPU.context.uniform1i(uniforms.axis, axis)
		GPU.context.uniform1i(uniforms.selectedAxis, clickedAxis)
		GPU.context.uniform1i(uniforms.cameraIsOrthographic, CameraAPI.notificationBuffers[2])
		mesh.simplifiedDraw()
	}
}
