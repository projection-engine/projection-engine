import {glMatrix, mat4, quat, vec3} from "gl-matrix"
import CameraAPI from "../../../core/lib/utils/CameraAPI"
import GizmoSystem from "../GizmoSystem"
import AXIS from "../../static/AXIS"
import GPU from "../../../core/GPU"
import EngineTools from "../../EngineTools"
import EditorActionHistory from "../../../../frontend/editor/services/EditorActionHistory"
import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import StaticEditorShaders from "../../utils/StaticEditorShaders"
import GizmoUtil from "../util/GizmoUtil"
import GizmoMouseUtil from "../util/GizmoMouseUtil"
import GizmoTransformationType from "../../../../shared/enums/GizmoTransformationType"
import Movable from "../../../core/instances/components/Movable"
import GizmoState from "../util/GizmoState"
import IGizmo from "../IGizmo"
import AbstractSingleton from "../../../../shared/AbstractSingleton"
import Entity from "../../../core/instances/Entity"
import Mesh from "../../../core/instances/Mesh"

const toDeg = 180 / Math.PI
const uniformCache = new Float32Array(4)
export default class RotationGizmo extends AbstractSingleton implements IGizmo {
	#currentRotation = vec3.create()
	#currentIncrement = 0

	mesh: Mesh
	xGizmo: Entity
	yGizmo: Entity
	zGizmo: Entity

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

	clearState(){
		this.#currentRotation.fill(0)
		this.#currentIncrement = 0
	}

	drawToDepth(data) {
		GizmoMouseUtil.drawToDepth(data, this.mesh, this.xGizmo.matrix, this.xGizmo.pickID)
		GizmoMouseUtil.drawToDepth(data, this.mesh, this.yGizmo.matrix, this.yGizmo.pickID)
		GizmoMouseUtil.drawToDepth(data, this.mesh, this.zGizmo.matrix, this.zGizmo.pickID)
	}

	onMouseMove(event: MouseEvent) {
		if (!GizmoState.mainEntity)
			return
		if (!GizmoState.hasTransformationStarted) {
			GizmoState.hasTransformationStarted = true
			EditorActionHistory.save(EngineTools.selected)
			GizmoSystem.updateGizmoToolTip()
		}

		const g = event.ctrlKey ? glMatrix.toRadian(1) : glMatrix.toRadian(GizmoState.rotationGridSize)
		this.#currentIncrement += event.movementX * GizmoState.sensitivity
		const mappedValue = Math.round(this.#currentIncrement / g) * g

		if (Math.abs(mappedValue) > 0)
			this.#currentIncrement = 0

		switch (GizmoState.clickedAxis) {
		case AXIS.X:
			this.#gizmoRotateEntity([mappedValue, 0, 0])
			break
		case AXIS.Y:
			this.#gizmoRotateEntity([0, mappedValue, 0])
			break
		case AXIS.Z:
			this.#gizmoRotateEntity([0, 0, mappedValue])
			break
		}
		GizmoState.hasTransformationStarted = true

		if (GizmoSystem.rotationRef) {
			const EX = this.#currentRotation[0] * 2 * toDeg,
				EY = this.#currentRotation[1] * 2 * toDeg,
				EZ = this.#currentRotation[2] * 2 * toDeg
			GizmoSystem.rotationRef.textContent = `X ${EX.toFixed(2)} | Y ${EY.toFixed(2)} | Z ${EZ.toFixed(2)}`
		}
	}


	transformGizmo() {
		if (!GizmoState.mainEntity)
			return
		this.#currentIncrement = 0
		mat4.copy(this.xGizmo.matrix, this.xGizmo.__cacheMatrix)
		mat4.copy(this.yGizmo.matrix, this.yGizmo.__cacheMatrix)
		mat4.copy(this.zGizmo.matrix, this.zGizmo.__cacheMatrix)

		GizmoUtil.translateMatrix(this.xGizmo)
		GizmoUtil.translateMatrix(this.yGizmo)
		GizmoUtil.translateMatrix(this.zGizmo)
	}

	drawGizmo() {
		if (!GizmoState.mainEntity)
			return
		this.#draw(this.xGizmo.matrix, AXIS.X)
		this.#draw(this.yGizmo.matrix, AXIS.Y)
		this.#draw(this.zGizmo.matrix, AXIS.Z)
	}

	#draw(transformMatrix, axis) {
		if (GizmoState.wasOnGizmo && GizmoState.clickedAxis === axis || !GizmoState.wasOnGizmo) {
			StaticEditorShaders.rotation.bind()
			const uniforms = StaticEditorShaders.rotationUniforms
			const context = GPU.context

			context.uniformMatrix4fv(uniforms.transformMatrix, false, transformMatrix)
			context.uniform3fv(uniforms.translation, GizmoState.mainEntity.__pivotOffset)
			context.uniform1i(uniforms.cameraIsOrthographic, CameraAPI.notificationBuffers[2])

			uniformCache[0] = axis
			uniformCache[1] = GizmoState.clickedAxis
			uniformCache[2] = this.#currentRotation[axis - 2]
			uniformCache[3] = glMatrix.toRadian(GizmoState.rotationGridSize)
			context.uniform4fv(uniforms.metadata, uniformCache)

			this.mesh.draw()
		}
	}

	#gizmoRotateEntity(vec: [number, number, number] | Float32Array, screenSpace?: boolean) {
		const firstEntity = GizmoState.mainEntity
		if (!firstEntity)
			return
		const targets = EngineTools.selected, SIZE = targets.length
		if (SIZE === 1 && firstEntity.lockedRotation)
			return
		const quatA = quat.create()
		if (screenSpace)
			this.#currentRotation = vec
		else
			vec3.add(this.#currentRotation, this.#currentRotation, vec)
		if (vec[0] !== 0)
			quat.rotateX(quatA, quatA, vec[0])
		if (vec[1] !== 0)
			quat.rotateY(quatA, quatA, vec[1])
		if (vec[2] !== 0)
			quat.rotateZ(quatA, quatA, vec[2])

		const isGlobalRotation = GizmoState.transformationType === GizmoTransformationType.GLOBAL && SIZE === 1
		for (let i = 0; i < SIZE; i++) {
			const target = targets[i]
			if (target.lockedRotation)
				continue
			if (screenSpace) {
				quat.copy(target.rotationQuaternion, quatA)
				continue
			}

			const isQuaternionRotation = target.rotationType[0] === Movable.ROTATION_QUATERNION
			if (isQuaternionRotation) {
				if (isGlobalRotation)
					quat.multiply(target.rotationQuaternion, quatA, target.rotationQuaternion)
				else
					quat.multiply(target.rotationQuaternion, target.rotationQuaternion, quatA)
			} else
				vec3.add(target.rotationEuler, target.rotationEuler, vec)
			target.__changedBuffer[0] = 1
		}
	}
}
