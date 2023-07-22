import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import {vec3} from "gl-matrix"
import GizmoUtil from "../util/GizmoUtil"
import EngineTools from "../../EngineTools"
import GizmoState from "../util/GizmoState"
import GizmoSystem from "../GizmoSystem"
import AbstractXYZGizmo from "./AbstractXYZGizmo";

export default class ScalingGizmo extends AbstractXYZGizmo {
	#INVERSE_CACHE = vec3.create()

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

	onMouseMove(event) {
		this.#gizmoScaleEntity(event)
	}

	#gizmoScaleEntity(event) {
		const firstEntity = GizmoState.mainEntity
		if (!firstEntity)
			return
		const grid = event.ctrlKey ? 1 : GizmoState.scalingGridSize
		const vec = GizmoUtil.mapToScreenMovement(event)

		if (!GizmoState.isGlobal)
			vec3.transformQuat(vec, vec, firstEntity.rotationQuaternionFinal)
		vec[0] = GizmoUtil.nearestX(vec[0], grid)
		vec[1] = GizmoUtil.nearestX(vec[1], grid)
		vec[2] = GizmoUtil.nearestX(vec[2], grid)

		const hasToTranslate = GizmoState.isGlobal && event.altKey
		if (hasToTranslate)
			vec3.scale(this.#INVERSE_CACHE, vec, -1)
		const entities = EngineTools.selected
		const SIZE = entities.length
		if (SIZE === 1 && entities[0].lockedScaling)
			return
		for (let i = 0; i < SIZE; i++) {
			const target = entities[i]
			if (target.lockedScaling)
				continue
			GizmoUtil.assignValueToVector(vec, target._scaling)
			if (hasToTranslate)
				vec3.add(target._translation, target._translation, this.#INVERSE_CACHE)
			target.__changedBuffer[0] = 1
		}
		GizmoSystem.callListeners()
	}

}
