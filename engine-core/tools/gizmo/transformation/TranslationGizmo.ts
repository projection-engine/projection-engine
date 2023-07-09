import EngineTools from "../../EngineTools"
import StaticEditorMeshes from "../../utils/StaticEditorMeshes"
import EngineStateService from "../../../../frontend/editor/services/engine/EngineStateService"
import {vec3} from "gl-matrix"
import GizmoUtil from "../util/GizmoUtil"
import GizmoState from "../util/GizmoState"
import GizmoMouseUtil from "../util/GizmoMouseUtil"
import AXIS from "../../static/AXIS"
import AbstractSingleton from "../../../../shared/AbstractSingleton"
import IGizmo from "../IGizmo"
import Mesh from "../../../core/instances/Mesh"
import Entity from "../../../core/instances/Entity"
import GizmoSystem from "../GizmoSystem"

export default class TranslationGizmo extends AbstractSingleton implements IGizmo {
	#hasCloned = false
	mesh: Mesh
	xGizmo: Entity
	yGizmo: Entity
	zGizmo: Entity

	constructor() {
		super()
		this.mesh = StaticEditorMeshes.translationGizmo
		this.xGizmo = TranslationGizmo.#mapGizmoMesh("x", 2)
		this.yGizmo = TranslationGizmo.#mapGizmoMesh("y", 3)
		this.zGizmo = TranslationGizmo.#mapGizmoMesh("z", 4)
	}

	static #mapGizmoMesh(axis: string, index: number) {
		const rotation = vec3.create()
		const scale = vec3.fromValues(.75, 0.05, 0.05)
		switch (axis) {
		case "y":
			vec3.copy(rotation, [0, 0, Math.PI / 2])
			break
		case "z":
			vec3.copy(rotation, [Math.PI, -Math.PI / 2, Math.PI])
			break
		}
		return GizmoUtil.getGizmoEntity(index, rotation, scale)
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

	clearState() {
		this.#hasCloned = false
	}

	drawGizmo() {
		GizmoUtil.drawGizmo(this.mesh, this.xGizmo.matrix, AXIS.X)
		GizmoUtil.drawGizmo(this.mesh, this.yGizmo.matrix, AXIS.Y)
		GizmoUtil.drawGizmo(this.mesh, this.zGizmo.matrix, AXIS.Z)
	}


	onMouseMove(event: MouseEvent) {
		if (!this.#hasCloned && event.shiftKey) {
			const clones = EngineTools.selected.map(m => m.clone())
			EngineStateService.appendBlock(clones)
			GizmoState.mainEntity = clones[0]
		}
		this.#hasCloned = event.shiftKey
		this.#gizmoTranslateEntity(event)
	}

	#gizmoTranslateEntity(event) {
		const firstEntity = GizmoState.mainEntity
		if (!firstEntity)
			return
		const grid = event.ctrlKey ? 1 : GizmoState.translationGridSize
		const vec = GizmoUtil.mapToScreenMovement(event)

		if (!GizmoState.isGlobal)
			vec3.transformQuat(vec, vec, firstEntity.rotationQuaternionFinal)

		vec[0] = GizmoUtil.nearestX(vec[0], grid)
		vec[1] = GizmoUtil.nearestX(vec[1], grid)
		vec[2] = GizmoUtil.nearestX(vec[2], grid)

		const entities = EngineTools.selected
		const SIZE = entities.length
		if (SIZE === 1 && entities[0].lockedTranslation)
			return
		for (let i = 0; i < SIZE; i++) {
			const target = entities[i]
			if (target.lockedTranslation)
				continue
			if (SIZE === 1 && event.altKey) {
				GizmoUtil.assignValueToVector(vec, target.pivotPoint)
				target.__pivotChanged = true
				continue
			}
			GizmoUtil.assignValueToVector(vec, target._translation)
			target.__changedBuffer[0] = 1
		}

		GizmoSystem.callListeners()
	}


}
