import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import {quat, vec3, vec4} from "gl-matrix"
import GizmoUtil from "../util/GizmoUtil"
import AXIS from "../../static/AXIS"
import EngineTools from "../../EngineTools"
import GizmoState from "../util/GizmoState"
import GizmoMouseUtil from "../util/GizmoMouseUtil"
import Mesh from "../../../core/instances/Mesh"
import Entity from "../../../core/instances/Entity"
import AbstractSingleton from "../../../../shared/AbstractSingleton"
import IGizmo from "../IGizmo"
import GizmoSystem from "../GizmoSystem"

export default class ScalingGizmo extends AbstractSingleton implements IGizmo {
	#INVERSE_CACHE = vec3.create()
	#SCALE_CACHE = quat.create()
	#cache = vec3.create()

	mesh: Mesh
	xGizmo: Entity
	yGizmo: Entity
	zGizmo: Entity

	constructor() {
		super()
		this.mesh = StaticEditorMeshes.scaleGizmo
		this.xGizmo = ScalingGizmo.#mapGizmoMesh("x", 2)
		this.yGizmo = ScalingGizmo.#mapGizmoMesh("y", 3)
		this.zGizmo = ScalingGizmo.#mapGizmoMesh("z", 4)
	}

	static #mapGizmoMesh(axis: string, index: number) {
		const rotation = vec3.create()
		const scale = vec3.fromValues(.2, 0.2, 0.2)
		switch (axis) {
		case "x":
			vec3.copy(rotation, [0, Math.PI / 2, 0])
			break
		case "y":
			vec3.copy(rotation, [-Math.PI / 2, Math.PI / 2, 0])
			break
		case "z":
			vec3.copy(rotation, [Math.PI, -Math.PI, Math.PI])
			break
		}
		return GizmoUtil.getGizmoEntity(index, rotation, scale)
	}

	clearState(){
		this.#cache.fill(0)
	}

	drawToDepth(data) {
		GizmoMouseUtil.drawToDepth(data, this.mesh, this.xGizmo.matrix, this.xGizmo.pickID)
		GizmoMouseUtil.drawToDepth(data, this.mesh, this.yGizmo.matrix, this.yGizmo.pickID)
		GizmoMouseUtil.drawToDepth(data, this.mesh, this.zGizmo.matrix, this.zGizmo.pickID)
	}

	transformGizmo() {
		GizmoUtil.translateMatrix(this.xGizmo)
		GizmoUtil.translateMatrix(this.yGizmo)
		GizmoUtil.translateMatrix(this.zGizmo)
	}

	drawGizmo() {
		GizmoUtil.drawGizmo(this.mesh, this.xGizmo.matrix, AXIS.X)
		GizmoUtil.drawGizmo(this.mesh, this.yGizmo.matrix, AXIS.Y)
		GizmoUtil.drawGizmo(this.mesh, this.zGizmo.matrix, AXIS.Z)
	}

	onMouseMove(event) {
		this.#gizmoScaleEntity(event)

	}


	#gizmoScaleEntity(event) {
		const CACHE = <vec3>this.#cache
		const firstEntity = GizmoState.mainEntity
		if (!firstEntity)
			return
		const isGlobal = GizmoState.isGlobal
		const g = event.ctrlKey ? 1 : GizmoState.scalingGridSize
		if (GizmoState.clickedAxis !== AXIS.SCREEN_SPACE) {
			const c = GizmoUtil.mapToScreenMovement(event)
			this.#SCALE_CACHE[0] = c[0]
			this.#SCALE_CACHE[1] = c[1]
			this.#SCALE_CACHE[2] = c[2]
		}
		switch (GizmoState.clickedAxis) {
		case AXIS.SCREEN_SPACE:
			this.#SCALE_CACHE[0] = this.#SCALE_CACHE[1] = this.#SCALE_CACHE[2] = ScalingGizmo.#getAxisMovement(event) / 50
			break
		case AXIS.XY:
			this.#SCALE_CACHE[2] = 0
			break
		case AXIS.XZ:
			this.#SCALE_CACHE[1] = 0
			break
		case AXIS.ZY:
			this.#SCALE_CACHE[0] = 0
			break
		}

		if (isGlobal)
			vec4.transformQuat(this.#SCALE_CACHE, <vec4>this.#SCALE_CACHE, GizmoState.targetRotation)

		vec3.add(CACHE, CACHE, <vec3>this.#SCALE_CACHE)

		if (Math.abs(CACHE[0]) >= g || Math.abs(CACHE[1]) >= g || Math.abs(CACHE[2]) >= g) {
			const hasToTranslate = isGlobal && event.altKey
			if (hasToTranslate)
				vec3.scale(this.#INVERSE_CACHE, CACHE, -1)
			const entities = EngineTools.selected
			const SIZE = entities.length
			if (SIZE === 1 && entities[0].lockedScaling)
				return
			for (let i = 0; i < SIZE; i++) {
				const target = entities[i]
				if (target.lockedScaling)
					continue

				vec3.add(target._scaling, target._scaling, CACHE)
				if (hasToTranslate)
					vec3.add(target._translation, target._translation, this.#INVERSE_CACHE)
				for (let j = 0; j < 3; j++)
					target._scaling[j] = Math.round(target._scaling[j] / g) * g
				target.__changedBuffer[0] = 1
			}
			CACHE[0] = CACHE[2] = CACHE[1] = 0
			GizmoSystem.callListeners()
		}

		this.#SCALE_CACHE[2] = this.#SCALE_CACHE[1] = this.#SCALE_CACHE[0] = 0
	}

	static #getAxisMovement(event) {
		return Math.abs(event.movementX) > Math.abs(event.movementY) ? event.movementX : event.movementY
	}

}
