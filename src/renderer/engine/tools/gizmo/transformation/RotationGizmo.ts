import {glMatrix, quat, vec3} from "gl-matrix"
import CameraAPI from "../../../core/lib/utils/CameraAPI"
import AXIS from "../../static/AXIS"
import GPU from "../../../core/GPU"
import EngineTools from "../../EngineTools"
import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import StaticEditorShaders from "../../utils/StaticEditorShaders"
import GizmoUtil from "../util/GizmoUtil"
import GizmoTransformationType from "../../../../../shared/enums/GizmoTransformationType"
import Movable from "../../../core/instances/components/Movable"
import GizmoState from "../util/GizmoState"
import GizmoSystem from "../GizmoSystem"
import AbstractXYZGizmo from "./AbstractXYZGizmo";
import GPUUtil from "../../../core/utils/GPUUtil";
import StaticEditorFBO from "../../utils/StaticEditorFBO";
import EngineToolsState from "../../EngineToolsState";

const toDeg = 180 / Math.PI
const uniformCache = new Float32Array(4)
export default class RotationGizmo extends AbstractXYZGizmo{
	#currentRotation = vec3.create()
	#currentIncrement = 0

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

	clearState() {
		this.#currentRotation.fill(0)
		this.#currentIncrement = 0
	}

	drawGizmo() {
		if (!GizmoState.mainEntity)
			return
		this.#draw(this.xGizmo.matrix, AXIS.X)
		this.#draw(this.yGizmo.matrix, AXIS.Y)
		this.#draw(this.zGizmo.matrix, AXIS.Z)
	}

	#draw(transformMatrix, axis) {
		if (GizmoState.clickedAxis === axis || GizmoState.clickedAxis === AXIS.NONE) {
			StaticEditorShaders.rotation.bind()
			const uniforms = StaticEditorShaders.rotationUniforms
			const context = GPU.context

			context.uniformMatrix4fv(uniforms.transformMatrix, false, transformMatrix)
			context.uniform3fv(uniforms.translation, GizmoState.mainEntity.__pivotOffset)
			context.uniform1i(uniforms.cameraIsOrthographic, CameraAPI.notificationBuffers[2])

			GPUUtil.bind2DTextureForDrawing(uniforms.gizmoIDS, 0, StaticEditorFBO.gizmo.colors[0])
			GPU.context.uniform2fv(uniforms.mouseCoordinates, EngineToolsState.mouseCoordinates)

			uniformCache[0] = axis
			uniformCache[1] = GizmoState.clickedAxis
			uniformCache[2] = this.#currentRotation[axis - 2]
			uniformCache[3] = glMatrix.toRadian(GizmoState.rotationGridSize)
			context.uniform4fv(uniforms.metadata, uniformCache)

			this.mesh.draw()
		}
	}

	onMouseMove(event: MouseEvent) {
		const grid = event.ctrlKey ? 1 : GizmoState.rotationGridSize
		this.#currentIncrement -= event.movementX
		if (Math.abs(this.#currentIncrement) < grid)
			return
		const mappedValue = glMatrix.toRadian(GizmoUtil.nearestX(this.#currentIncrement, grid))
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
			GizmoSystem.callListeners()
		}
	}
}
