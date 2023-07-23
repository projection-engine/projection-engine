import {mat4, quat, vec3} from "gl-matrix"
import GizmoSystem from "../GizmoSystem"
import Entity from "../../../core/instances/Entity"
import PickingAPI from "../../../core/lib/utils/PickingAPI"
import EntityAPI from "../../../core/lib/utils/EntityAPI"
import StaticEditorShaders from "../../utils/StaticEditorShaders"
import GPU from "../../../core/GPU"
import CameraAPI from "../../../core/lib/utils/CameraAPI"
import GizmoState from "./GizmoState"
import AXIS from "../../static/AXIS"
import ConversionAPI from "../../../core/lib/math/ConversionAPI"
import Mesh from "../../../core/instances/Mesh";
import StaticEditorFBO from "../../utils/StaticEditorFBO";
import GPUUtil from "../../../core/utils/GPUUtil";
import EngineToolsState from "../../EngineToolsState";


export default class GizmoUtil {
	static updateGizmosTransformation(clearState = false) {
		for (let i = 0; i < GizmoState.targetGizmos.length; i++) {
			const gizmo = GizmoState.targetGizmos[i]
			if (clearState)
				gizmo.clearState()
			gizmo.transformGizmo()
		}
	}

	static createTransformationCache(entity) {
		if (entity.__changedBuffer[1] || !entity.__cacheCenterMatrix || entity.__pivotChanged) {
			const m = !entity.__cacheCenterMatrix ? mat4.create() : entity.__cacheCenterMatrix
			GizmoUtil.#getPivotPointTranslation(entity)

			mat4.fromRotationTranslationScale(m, entity.rotationQuaternionFinal, entity.__pivotOffset, [.25, .25, .25])
			entity.__cacheCenterMatrix = m
			if (!entity.__cacheIconMatrix)
				entity.__cacheIconMatrix = mat4.create()
			mat4.copy(entity.__cacheIconMatrix, entity.__cacheCenterMatrix)

			entity.__cacheIconMatrix[12] = entity.absoluteTranslation[0]
			entity.__cacheIconMatrix[13] = entity.absoluteTranslation[1]
			entity.__cacheIconMatrix[14] = entity.absoluteTranslation[2]

			if (GizmoState.mainEntity) GizmoSystem.callListeners()
			entity.__pivotChanged = false
		}
	}

	static #getPivotPointTranslation(entity: Entity) {
		const p = entity.pivotPoint
		const a = entity.absoluteTranslation
		if (!entity.__pivotOffset)
			entity.__pivotOffset = new Float32Array([0, 0, 0])
		vec3.add(<Float32Array>entity.__pivotOffset, a, p)

	}

	static getGizmoEntity(index: number, rotation: vec3, scaling: vec3) {
		const TO_DEG = 57.29
		const entity = EntityAPI.getNewEntityInstance()
		const pickID = PickingAPI.getPickerId(index)

		entity.pickID[0] = pickID[0]
		entity.pickID[1] = pickID[1]
		entity.pickID[2] = pickID[2]
		vec3.copy(<vec3>entity._scaling, scaling)
		quat.fromEuler(<quat>entity._rotationQuaternion, TO_DEG * rotation[0], TO_DEG * rotation[1], TO_DEG * rotation[2])
		quat.normalize(entity._rotationQuaternion, entity._rotationQuaternion)
		mat4.fromRotationTranslationScale(entity.matrix, entity._rotationQuaternion, <vec3>entity._translation, <vec3>entity._scaling)
		entity.__cacheMatrix = mat4.clone(entity.matrix)
		return entity
	}

	static drawGizmo(mesh:Mesh, transformMatrix:mat4, axis:AXIS) {
		StaticEditorShaders.gizmo.bind()
		const uniforms = StaticEditorShaders.gizmoUniforms
		GPUUtil.bind2DTextureForDrawing(uniforms.gizmoIDS, 0, StaticEditorFBO.gizmo.colors[0])
		GPU.context.uniform2fv(uniforms.mouseCoordinates, EngineToolsState.mouseCoordinates)

		GPU.context.uniformMatrix4fv(uniforms.transformMatrix, false, transformMatrix)
		GPU.context.uniform3fv(uniforms.translation, GizmoState.mainEntity.__pivotOffset)
		GPU.context.uniform1i(uniforms.axis, axis)
		GPU.context.uniform1i(uniforms.selectedAxis, GizmoState.clickedAxis)
		GPU.context.uniform1i(uniforms.cameraIsOrthographic, CameraAPI.notificationBuffers[2])
		mesh.simplifiedDraw()
	}


	static drawGizmoToDepth() {
		const data = {
			translation: GizmoState.mainEntity.__pivotOffset,
			cameraIsOrthographic: CameraAPI.isOrthographic
		}
		StaticEditorFBO.gizmo.startMapping()
		for (let i = 0; i < GizmoState.targetGizmos.length; i++) {
			GizmoState.targetGizmos[i].drawToDepth(data)
		}
		StaticEditorFBO.gizmo.stopMapping()
	}

	static drawToDepth(data, mesh, transformation, pickId) {
		data.transformMatrix = transformation
		data.uID = pickId
		StaticEditorShaders.toDepthBuffer.bindForUse(data)
		mesh.draw()
	}

	static translateMatrix(entity: Entity) {
		GizmoUtil.applyTransformation(entity.matrix, entity.rotationQuaternion, entity.translation, entity.scaling)
	}

	static applyTransformation(matrix: Float32Array, quaternion: Float32Array, translation: Float32Array, scale: Float32Array): void {
		const mainEntity = GizmoState.mainEntity
		if (!mainEntity)
			return
		const isRelative = !GizmoState.isGlobal
		if (isRelative || mainEntity.parent) {
			const quatToMultiply = isRelative ? GizmoState.targetRotation : mainEntity.parent.rotationQuaternionFinal
			if (!quatToMultiply)
				return
			let cacheVec3 = vec3.create()
			let cacheQuat = quat.create()

			vec3.add(cacheVec3, mainEntity.__pivotOffset, translation)
			quat.multiply(cacheQuat, quatToMultiply, quaternion)
			mat4.fromRotationTranslationScaleOrigin(
				matrix,
				cacheQuat,
				cacheVec3,
				scale,
				translation
			)
			cacheQuat = null
			cacheVec3 = null
		} else {
			matrix[12] += mainEntity.__pivotOffset[0]
			matrix[13] += mainEntity.__pivotOffset[1]
			matrix[14] += mainEntity.__pivotOffset[2]
		}
	}

	static nearestX(num, x) {
		return num === 0 ? 0 : Math.round(num / x) * x
	}

	static assignValueToVector(vecValue: vec3, target: vec3) {
		if (vecValue[0] !== 0) {
			target[0] = vecValue[0]
		}
		if (vecValue[1] !== 0) {
			target[1] = vecValue[1]
		}
		if (vecValue[2] !== 0) {
			target[2] = vecValue[2]
		}
	}

	static mapToScreenMovement(event: MouseEvent, scaleVec=false): vec3 {
		if (GizmoState.clickedAxis === AXIS.NONE)
			return [0, 0, 0]
		const distanceFrom = <vec3>CameraAPI.position
		const scale = vec3.len(distanceFrom)
		const worldCoordinates = ConversionAPI.toWorldCoordinates(event.clientX, event.clientY)
		if(scaleVec){
			vec3.scale(worldCoordinates, worldCoordinates, scale)
			vec3.add(worldCoordinates, worldCoordinates, distanceFrom)
		}
		GizmoUtil.#mapToAxis(worldCoordinates)
		return worldCoordinates
	}

	static #mapToAxis(vec: vec3 | Float32Array) {
		switch (GizmoState.clickedAxis) {
		case AXIS.X:
			vec[1] = 0
			vec[2] = 0
			break
		case AXIS.Y:
			vec[0] = 0
			vec[2] = 0
			break
		case AXIS.Z:
			vec[0] = 0
			vec[1] = 0
			break
		case AXIS.XZ:
			vec[1] = 0
			break
		case AXIS.XY:
			vec[2] = 0
			break
		case AXIS.ZY:
			vec[0] = 0
			break
		case AXIS.NONE:
			vec[0] = 0
			vec[1] = 0
			vec[2] = 0
			break
		}
	}


}
