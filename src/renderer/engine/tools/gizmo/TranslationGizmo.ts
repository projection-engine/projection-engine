import EngineTools from "../EngineTools"
import StaticEditorMeshes from "../utils/StaticEditorMeshes"
import {vec3} from "gl-matrix"
import GizmoUtil from "./util/GizmoUtil"
import GizmoState from "./util/GizmoState"
import GizmoSystem from "../systems/GizmoSystem"
import AbstractXYZGizmo from "./AbstractXYZGizmo";
import EngineToolsState from "../EngineToolsState";
import {Components} from "@engine-core/engine.enum";
import TransformationComponent from "@engine-core/components/TransformationComponent";

export default class TranslationGizmo extends AbstractXYZGizmo {
	#hasCloned = false

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

	clearState() {
		this.#hasCloned = false
	}

	onMouseMove(event: MouseEvent) {
		if (!this.#hasCloned && event.shiftKey) {
			const clones = EngineTools.selected.map(m => m.clone())
			GizmoState.mainEntity = clones[0]
		}
		this.#hasCloned = event.shiftKey
		this.#gizmoTranslateEntity(event)
	}

	#gizmoTranslateEntity(event) {
		if (!GizmoState.mainEntity)
			return
		const entities = EngineTools.selected
		const SIZE = entities.length
		const grid = event.ctrlKey ? 1 : GizmoState.translationGridSize
		const vec = GizmoUtil.mapToScreenMovement(event, true)
		const componentRoot = entities[0].getComponent<TransformationComponent>(Components.TRANSFORMATION)
		if (SIZE === 1 && (!componentRoot || componentRoot.lockedTranslation))
			return
		if (!GizmoState.isGlobal)
			vec3.transformQuat(vec, vec, componentRoot.rotationQuaternionFinal)

		vec[0] = GizmoUtil.nearestX(vec[0], grid)
		vec[1] = GizmoUtil.nearestX(vec[1], grid)
		vec[2] = GizmoUtil.nearestX(vec[2], grid)

		for (let i = 0; i < SIZE; i++) {
			const target = entities[i].getComponent<TransformationComponent>(Components.TRANSFORMATION)
			if (!target || target.lockedTranslation)
				continue
			if (SIZE === 1 && event.altKey) {
				GizmoUtil.assignValueToVector(vec, target.pivotPoint)
				EngineToolsState.pivotChanged.set(target.entity, true)
				continue
			}
			GizmoUtil.assignValueToVector(vec, target._translation)
			target.__changedBuffer[0] = 1
		}

		GizmoSystem.callListeners()
	}
}
