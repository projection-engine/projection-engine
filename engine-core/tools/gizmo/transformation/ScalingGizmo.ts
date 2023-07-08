import Inheritance from "../Inheritance"
import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import GizmoSystem from "../GizmoSystem"
import {quat, vec3, vec4} from "gl-matrix"
import GizmoUtil from "../util/GizmoUtil"
import GizmoAPI from "../util/GizmoAPI"
import AXIS from "../../static/AXIS"
import ScreenSpaceGizmo from "./ScreenSpaceGizmo"
import EngineTools from "../../EngineTools"

export default class ScalingGizmo extends Inheritance {
	static gridSize = 1
	key = "_scaling"
	static #INVERSE_CACHE = vec3.create()
	static #SCALE_CACHE = quat.create()
	static cache = vec3.create()

	constructor() {
		super()
		this.xyz = StaticEditorMeshes.scaleGizmo
		this.xGizmo = ScalingGizmo.#mapGizmoMesh("x", 2)
		this.yGizmo = ScalingGizmo.#mapGizmoMesh("y", 3)
		this.zGizmo = ScalingGizmo.#mapGizmoMesh("z", 4)
	}

	static #mapGizmoMesh(axis: string, index:number){
		const rotation = vec3.create()
		const scale = vec3.fromValues(.2, 0.2, 0.2)
		switch (axis) {
		case "x":
			vec3.copy(rotation, [0, Math.PI/2, 0])
			break
		case "y":
			vec3.copy(rotation, [-Math.PI/2, Math.PI/2, 0])
			break
		case "z":
			vec3.copy(rotation, [Math.PI, -Math.PI, Math.PI])
			break
		}
		return GizmoUtil.getGizmoEntity(index, rotation, scale)
	}

	onMouseDown(event) {
		super.onMouseDown(event)
		ScalingGizmo.cache = [0, 0, 0]
	}

	onMouseMove(event) {
		super.onMouseMove()
		ScalingGizmo.#gizmoScaleEntity(event)
		if(GizmoSystem.scaleRef) {
			const mainEntity = GizmoSystem.mainEntity
			GizmoSystem.scaleRef.textContent = `X ${mainEntity._scaling[0].toFixed(2)} | Y ${mainEntity._scaling[1].toFixed(2)} | Z ${mainEntity._scaling[2].toFixed(2)}`
		}
	}

	static #getAxisMovement(event) {
		return Math.abs(event.movementX) > Math.abs(event.movementY) ? event.movementX : event.movementY
	}

	static #gizmoScaleEntity(event) {
		const CACHE = <vec3>ScalingGizmo.cache
		const firstEntity = GizmoSystem.mainEntity
		if (!firstEntity)
			return
		const isGlobal = GizmoAPI.isGlobal
		const g = event.ctrlKey ? 1 : ScalingGizmo.gridSize
		if(GizmoSystem.clickedAxis !== AXIS.SCREEN_SPACE) {
			const c = ScreenSpaceGizmo.onMouseMove(event)
			ScalingGizmo.#SCALE_CACHE[0] = c[0]
			ScalingGizmo.#SCALE_CACHE[1] = c[1]
			ScalingGizmo.#SCALE_CACHE[2] = c[2]
		}
		switch (GizmoSystem.clickedAxis) {
		case AXIS.SCREEN_SPACE:
			ScalingGizmo.#SCALE_CACHE[0] = ScalingGizmo.#SCALE_CACHE[1] = ScalingGizmo.#SCALE_CACHE[2] = ScalingGizmo.#getAxisMovement(event) / 50
			break
		case AXIS.XY:
			ScalingGizmo.#SCALE_CACHE[2] = 0
			break
		case AXIS.XZ:
			ScalingGizmo.#SCALE_CACHE[1] = 0
			break
		case AXIS.ZY:
			ScalingGizmo.#SCALE_CACHE[0] = 0
			break
		}

		if (isGlobal) {
			vec4.transformQuat(ScalingGizmo.#SCALE_CACHE, <vec4>ScalingGizmo.#SCALE_CACHE, GizmoSystem.targetRotation)
			vec3.add(CACHE, CACHE, <vec3>ScalingGizmo.#SCALE_CACHE)
		} else
			vec3.add(CACHE, CACHE, <vec3>ScalingGizmo.#SCALE_CACHE)

		if (Math.abs(CACHE[0]) >= g || Math.abs(CACHE[1]) >= g || Math.abs(CACHE[2]) >= g) {
			const hasToTranslate = isGlobal && event.altKey
			if (hasToTranslate)
				vec3.scale(ScalingGizmo.#INVERSE_CACHE, CACHE, -1)
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
					vec3.add(target._translation, target._translation, ScalingGizmo.#INVERSE_CACHE)
				for (let j = 0; j < 3; j++)
					target._scaling[j] = Math.round(target._scaling[j] / g) * g
				target.__changedBuffer[0] = 1
			}
			CACHE[0] = CACHE[2] = CACHE[1] = 0
		}

		ScalingGizmo.#SCALE_CACHE[2] = ScalingGizmo.#SCALE_CACHE[1] = ScalingGizmo.#SCALE_CACHE[0] = 0
	}
}
