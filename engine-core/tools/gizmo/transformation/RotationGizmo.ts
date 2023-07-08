import {glMatrix, mat4, quat, vec3} from "gl-matrix"
import CameraAPI from "../../../core/lib/utils/CameraAPI"
import GizmoSystem from "../GizmoSystem"
import AXIS from "../../static/AXIS"
import GPU from "../../../core/GPU"
import EngineTools from "../../EngineTools"
import EditorActionHistory from "../../../../frontend/editor/services/EditorActionHistory"
import GizmoInterface from "../GizmoInterface"
import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import StaticEditorShaders from "../../utils/StaticEditorShaders"
import GizmoAPI from "../util/GizmoAPI"
import GizmoUtil from "../util/GizmoUtil"
import GizmoDepthPickingUtil from "../util/GizmoDepthPickingUtil"
import TRANSFORMATION_TYPE from "../../../../frontend/editor/static/TRANSFORMATION_TYPE"
import Movable from "../../../core/instances/components/Movable"

const toDeg = 180 / Math.PI
const uniformCache = new Float32Array(4)
export default class RotationGizmo extends GizmoInterface {
	static currentRotation = vec3.create()
	static gridSize = glMatrix.toRadian(1)
	static currentIncrement = 0

	constructor() {
		super()
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

	onMouseDown(event: MouseEvent) {
		GizmoDepthPickingUtil.onMouseDown(event)
	}

	onMouseUp() {
		if (GizmoSystem.hasStarted) {
			GizmoSystem.hasStarted = false
			EditorActionHistory.save(EngineTools.selected)
		}

		document.exitPointerLock()
		GizmoSystem.clickedAxis = -1
	}


	onMouseMove(event: MouseEvent) {
		if (!GizmoSystem.mainEntity)
			return
		if (!GizmoSystem.hasStarted) {
			GizmoSystem.hasStarted = true
			EditorActionHistory.save(EngineTools.selected)
			GizmoSystem.updateGizmoToolTip()
		}

		const g = event.ctrlKey ? glMatrix.toRadian(1) : glMatrix.toRadian(RotationGizmo.gridSize)
		RotationGizmo.currentIncrement += event.movementX * GizmoSystem.sensitivity
		const mappedValue = Math.round(RotationGizmo.currentIncrement / g) * g

		if (Math.abs(mappedValue) > 0)
			RotationGizmo.currentIncrement = 0

		switch (GizmoSystem.clickedAxis) {
		case AXIS.X:
			RotationGizmo.#gizmoRotateEntity([mappedValue, 0, 0])
			break
		case AXIS.Y:
			RotationGizmo.#gizmoRotateEntity([0, mappedValue, 0])
			break
		case AXIS.Z:
			RotationGizmo.#gizmoRotateEntity([0, 0, mappedValue])
			break
		default:
			break
		}
		GizmoSystem.hasStarted = true

		if (GizmoSystem.rotationRef) {
			const EX = RotationGizmo.currentRotation[0] * 2 * toDeg,
				EY = RotationGizmo.currentRotation[1] * 2 * toDeg,
				EZ = RotationGizmo.currentRotation[2] * 2 * toDeg
			GizmoSystem.rotationRef.textContent = `X ${EX.toFixed(2)} | Y ${EY.toFixed(2)} | Z ${EZ.toFixed(2)}`
		}
	}



	transformGizmo() {
		if (!GizmoSystem.mainEntity)
			return
		RotationGizmo.currentIncrement = 0
		mat4.copy(this.xGizmo.matrix, this.xGizmo.__cacheMatrix)
		mat4.copy(this.yGizmo.matrix, this.yGizmo.__cacheMatrix)
		mat4.copy(this.zGizmo.matrix, this.zGizmo.__cacheMatrix)

		GizmoAPI.translateMatrix(this.xGizmo)
		GizmoAPI.translateMatrix(this.yGizmo)
		GizmoAPI.translateMatrix(this.zGizmo)
	}

	drawGizmo() {
		if (!GizmoSystem.mainEntity)
			return
		RotationGizmo.#draw(this.xGizmo.matrix, AXIS.X)
		RotationGizmo.#draw(this.yGizmo.matrix, AXIS.Y)
		RotationGizmo.#draw(this.zGizmo.matrix, AXIS.Z)
	}

	static #draw(transformMatrix, axis) {
		if (GizmoSystem.wasOnGizmo && GizmoSystem.clickedAxis === axis || !GizmoSystem.wasOnGizmo) {
			StaticEditorShaders.rotation.bind()
			const uniforms = StaticEditorShaders.rotationUniforms
			const context = GPU.context

			context.uniformMatrix4fv(uniforms.transformMatrix, false, transformMatrix)
			context.uniform3fv(uniforms.translation, GizmoSystem.mainEntity.__pivotOffset)
			context.uniform1i(uniforms.cameraIsOrthographic, CameraAPI.notificationBuffers[2])

			uniformCache[0] = axis
			uniformCache[1] = GizmoSystem.clickedAxis
			uniformCache[2] = RotationGizmo.currentRotation[axis - 2]
			uniformCache[3] = glMatrix.toRadian(RotationGizmo.gridSize)
			context.uniform4fv(uniforms.metadata, uniformCache)

			StaticEditorMeshes.rotationGizmo.draw()
		}
	}
	static #gizmoRotateEntity(vec: [number, number, number] | Float32Array, screenSpace?: boolean) {
		const firstEntity = GizmoSystem.mainEntity
		if (!firstEntity)
			return
		const targets = EngineTools.selected, SIZE = targets.length
		if (SIZE === 1 && firstEntity.lockedRotation)
			return
		const quatA = quat.create()
		if (screenSpace)
			RotationGizmo.currentRotation = vec
		else
			vec3.add(RotationGizmo.currentRotation, RotationGizmo.currentRotation, vec)
		if (vec[0] !== 0)
			quat.rotateX(quatA, quatA, vec[0])
		if (vec[1] !== 0)
			quat.rotateY(quatA, quatA, vec[1])
		if (vec[2] !== 0)
			quat.rotateZ(quatA, quatA, vec[2])

		const isGlobalRotation = GizmoSystem.transformationType === TRANSFORMATION_TYPE.GLOBAL && SIZE === 1
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
			}
			else
				vec3.add(target.rotationEuler, target.rotationEuler, vec)
			target.__changedBuffer[0] = 1
		}
	}
}
