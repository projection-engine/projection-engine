import EditorEntity from "../EditorEntity"
import GizmoUtil from "../utils/GizmoUtil"
import AXIS from "../static/AXIS"
import GizmoTransformationType from "../../../../shared/enums/GizmoTransformationType"
import Gizmos from "../../../../shared/enums/Gizmos"
import TranslationGizmo from "../gizmo/TranslationGizmo"
import DualAxisGizmo from "../gizmo/DualAxisGizmo"
import ScreenSpaceGizmo from "../gizmo/ScreenSpaceGizmo"
import ScalingGizmo from "../gizmo/ScalingGizmo"
import RotationGizmo from "../gizmo/RotationGizmo"
import {vec3} from "gl-matrix"
import EngineToolsState from "./EngineToolsState";
import {Components} from "@engine-core/engine.enum";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import DynamicMap from "@engine-core/lib/DynamicMap";

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
    static listeners = new DynamicMap<string, Function>()

    static addListener(id: string, callback: Function) {
        GizmoState.listeners.set(id, callback)
    }

    static removeListener(id: string) {
        GizmoState.listeners.delete(id)
    }

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
        GizmoState.callListeners()
    }

    static get isGlobal() {
        return AXIS.SCREEN_SPACE === GizmoState.clickedAxis || GizmoState.transformationType === GizmoTransformationType.GLOBAL || EngineToolsState.selected.length > 1
    }

    static callListeners(updateTransformation = true) {
        if (updateTransformation)
            GizmoUtil.updateGizmosTransformation()
        const arr = GizmoState.listeners.array
        for (let i = 0; i < arr.length; i++) {
            arr[i]()
        }
    }
}
