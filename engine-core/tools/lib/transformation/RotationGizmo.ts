import {glMatrix, mat4, vec3} from "gl-matrix"
import mapGizmoMesh from "../../utils/map-gizmo-mesh"
import PickingAPI from "../../../lib/utils/PickingAPI"
import CameraAPI from "../../../lib/utils/CameraAPI"
import GizmoSystem from "../../runtime/GizmoSystem"
import AXIS from "../../static/AXIS"
import ScreenSpaceGizmo from "./ScreenSpaceGizmo"
import GPU from "../../../GPU"
import EngineTools from "../../EngineTools"
import EditorActionHistory from "../../../../frontend/editor/services/EditorActionHistory"
import gizmoRotateEntity from "../../utils/gizmo-rotate-entity"
import drawGizmoToDepth from "../../utils/draw-gizmo-to-depth"
import GizmoInterface from "../GizmoInterface"
import StaticEditorMeshes from "../StaticEditorMeshes"
import StaticEditorShaders from "../StaticEditorShaders"
import GizmoAPI from "../GizmoAPI"

const toDeg = 180 / Math.PI
const uniformCache = new Float32Array(4)
const cacheVec3 = vec3.create()
export default class RotationGizmo extends GizmoInterface {
	tracking = false
	static currentRotation = vec3.create()
	static gridSize = glMatrix.toRadian(1)
	static currentIncrement = 0

	constructor() {
		super()
		this.xGizmo = mapGizmoMesh("x", "ROTATION")
		this.yGizmo = mapGizmoMesh("y", "ROTATION")
		this.zGizmo = mapGizmoMesh("z", "ROTATION")
	}

	onMouseDown(event: MouseEvent) {
		this.x = event.clientX
		this.y = event.clientY

		RotationGizmo.currentIncrement = 0
		this.#testClick()
	}

	onMouseUp() {
		if (GizmoSystem.hasStarted) {
			GizmoSystem.hasStarted = false
			EditorActionHistory.save(EngineTools.selected)
		}

		document.exitPointerLock()
		GizmoSystem.clickedAxis = -1
		this.tracking = false
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
			gizmoRotateEntity([mappedValue, 0, 0])
			break
		case AXIS.Y:
			gizmoRotateEntity([0, mappedValue, 0])
			break
		case AXIS.Z:
			gizmoRotateEntity([0, 0, mappedValue])
			break
		case AXIS.SCREEN_SPACE:
			const position = vec3.add(cacheVec3, RotationGizmo.currentRotation, ScreenSpaceGizmo.onMouseMove(event))
			gizmoRotateEntity(position, true)
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

	#testClick() {
		if (!GizmoSystem.mainEntity)
			return
		drawGizmoToDepth(StaticEditorMeshes.rotationGizmo, [
			this.xGizmo.matrix,
			this.yGizmo.matrix,
			this.zGizmo.matrix,
		])
		const pickID = PickingAPI.readEntityID(this.x, this.y)
		GizmoSystem.clickedAxis = pickID

		if (pickID === 0)
			this.onMouseUp()
		else {
			GizmoSystem.wasOnGizmo = true
			this.tracking = true
			GPU.canvas.requestPointerLock()
		}
	}

	transformGizmo() {
		if (!GizmoSystem.mainEntity)
			return
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
		if (this.tracking && GizmoSystem.clickedAxis === AXIS.X || !this.tracking)
			RotationGizmo.#draw(this.xGizmo.matrix, AXIS.X)
		if (this.tracking && GizmoSystem.clickedAxis === AXIS.Y || !this.tracking)
			RotationGizmo.#draw(this.yGizmo.matrix, AXIS.Y)
		if (this.tracking && GizmoSystem.clickedAxis === AXIS.Z || !this.tracking)
			RotationGizmo.#draw(this.zGizmo.matrix, AXIS.Z)
	}

	static #draw(transformMatrix, axis) {
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
