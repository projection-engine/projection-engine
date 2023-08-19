import EditorEntity from "../../EditorEntity"
import GizmoUtil from "./GizmoUtil"
import GizmoSystem from "../../systems/GizmoSystem"
import AXIS from "../../static/AXIS"
import GizmoTransformationType from "../../../../../shared/enums/GizmoTransformationType"
import EngineTools from "../../EngineTools"
import IGizmo from "../IGizmo"
import Gizmos from "../../../../../shared/enums/Gizmos"
import TranslationGizmo from "../TranslationGizmo"
import DualAxisGizmo from "../DualAxisGizmo"
import ScreenSpaceGizmo from "../ScreenSpaceGizmo"
import ScalingGizmo from "../ScalingGizmo"
import RotationGizmo from "../RotationGizmo"
import {vec3} from "gl-matrix"
import EngineToolsState from "../../EngineToolsState";
import {Components} from "@engine-core/engine.enum";
import TransformationComponent from "@engine-core/components/TransformationComponent";

export default class GizmoState {
    static #mainEntity?: EditorEntity
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

    static set mainEntity(mainEntity: EditorEntity|undefined) {

        if (mainEntity === undefined) {
            GizmoState.targetRotation = undefined
            GizmoState.#mainEntity = undefined
            return
        }
        const tComponent = mainEntity.getComponent<TransformationComponent>(Components.TRANSFORMATION)
        if (!mainEntity.active || !tComponent)
            return
        GizmoUtil.createTransformationCache(mainEntity)
        EngineToolsState.pivotChanged.set(mainEntity.id, false)
        GizmoState.#mainEntity = mainEntity
        GizmoState.targetRotation = tComponent.rotationQuaternionFinal
        GizmoUtil.updateGizmosTransformation(true)
        GizmoSystem.callListeners()
    }

    static get isGlobal() {
        return AXIS.SCREEN_SPACE === GizmoState.clickedAxis || GizmoState.transformationType === GizmoTransformationType.GLOBAL || EngineTools.selected.length > 1
    }

}
