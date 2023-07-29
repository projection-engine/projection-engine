import Entity from "../../../core/instances/Entity"
import GizmoUtil from "./GizmoUtil"
import GizmoSystem from "../GizmoSystem"
import AXIS from "../../static/AXIS"
import GizmoTransformationType from "../../../../../shared/enums/GizmoTransformationType"
import EngineTools from "../../EngineTools"
import IGizmo from "../IGizmo"
import Gizmos from "../../../../../shared/enums/Gizmos"
import TranslationGizmo from "../transformation/TranslationGizmo"
import DualAxisGizmo from "../transformation/DualAxisGizmo"
import ScreenSpaceGizmo from "../transformation/ScreenSpaceGizmo"
import ScalingGizmo from "../transformation/ScalingGizmo"
import RotationGizmo from "../transformation/RotationGizmo"
import {vec3} from "gl-matrix"

export default class GizmoState {
	static #mainEntity?: Entity
	static targetRotation?: Float32Array
	static #targetGizmos: IGizmo[] = []
	static hasTransformationStarted = false
	static clickedAxis = AXIS.NONE
	static transformationType = GizmoTransformationType.GLOBAL
	static sensitivity = .001
	static wasOnGizmo = false
	static rotationGridSize = 1
	static translationGridSize = 1
	static scalingGridSize = 1
	static #gizmoType = Gizmos.NONE
	static initialEntityPosition = vec3.create()
	static get targetGizmos() {
		return GizmoState.#targetGizmos
	}

	static get gizmoType() {
		return GizmoState.#gizmoType
	}

	static set gizmoType(data: Gizmos) {
		GizmoState.#gizmoType = data
		GizmoState.#targetGizmos.length = 0
		switch (data) {
		case Gizmos.TRANSLATION:
			GizmoState.#targetGizmos.push(TranslationGizmo.get(), DualAxisGizmo.get(), ScreenSpaceGizmo.get())
			break
		case Gizmos.ROTATION:
			GizmoState.#targetGizmos.push(RotationGizmo.get())
			break
		case Gizmos.SCALE:
			GizmoState.#targetGizmos.push(ScalingGizmo.get(), DualAxisGizmo.get(), ScreenSpaceGizmo.get())
			break
		}
		GizmoUtil.updateGizmosTransformation(true)
	}

	static get mainEntity() {
		return GizmoState.#mainEntity
	}

	static set mainEntity(mainEntity) {
		if (mainEntity === undefined) {
			GizmoState.targetRotation = undefined
			GizmoState.#mainEntity = undefined
			return
		}
		if (mainEntity?.isCollection || !mainEntity?.active)
			return
		GizmoUtil.createTransformationCache(mainEntity)
		mainEntity.__pivotChanged = true
		GizmoState.#mainEntity = mainEntity
		GizmoState.targetRotation = mainEntity.rotationQuaternionFinal
		GizmoUtil.updateGizmosTransformation(true)
		GizmoSystem.callListeners()
	}

	static get isGlobal() {
		return AXIS.SCREEN_SPACE === GizmoState.clickedAxis || GizmoState.transformationType === GizmoTransformationType.GLOBAL || EngineTools.selected.length > 1
	}

}
