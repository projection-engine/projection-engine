import TranslationGizmo from "../lib/transformation/TranslationGizmo"
import RotationGizmo from "../lib/transformation/RotationGizmo"
import ScalingGizmo from "../lib/transformation/ScalingGizmo"
import TRANSFORMATION_TYPE from "../../frontend/window-editor/static/TRANSFORMATION_TYPE"
import ScreenSpaceGizmo from "../lib/transformation/ScreenSpaceGizmo";
import AXIS from "../static/AXIS";
import {mat4, quat, vec3} from "gl-matrix";
import getPivotPointMatrix from "../utils/get-pivot-point-matrix";
import GizmoAPI from "../lib/GizmoAPI";
import LineRenderer from "./LineRenderer";
import Entity from "../../engine-core/instances/Entity";


const lineMatrix = <Float32Array>mat4.create()
const NULL_QUAT = <Float32Array>quat.create()
const NULL_VEC3 = <Float32Array>vec3.create()
const NULL_VEC3_1 = <Float32Array>vec3.create().fill(1)

const LINE_SIZE = 1000000;
export default class GizmoSystem   {
    static mainEntity?: Entity
    static onStart?: Function
    static onStop?: Function
    static targetRotation?: Float32Array
    static targetGizmo?: TranslationGizmo | RotationGizmo | ScalingGizmo

    static clickedAxis?: number
    static sensitivity = .001
    static hasStarted = false
    static #wasOnGizmo = false
    static highlightX: boolean = false
    static highlightY: boolean = false
    static highlightZ: boolean = false

    static translationRef:HTMLElement
    static rotationRef:HTMLElement
    static scaleRef:HTMLElement

    static get wasOnGizmo() {
        return GizmoSystem.#wasOnGizmo
    }


    static set wasOnGizmo(data) {
        GizmoSystem.#wasOnGizmo = data
        if (data)
            GizmoSystem.onStart?.()
        else
            GizmoSystem.onStop?.()
    }

    static tooltip
    static translationGizmo?: TranslationGizmo
    static scaleGizmo?: ScalingGizmo
    static rotationGizmo?: RotationGizmo
    static transformationType = TRANSFORMATION_TYPE.GLOBAL

    static updateGizmoToolTip = () => null

    static linkEntityToGizmo(main) {
        getPivotPointMatrix(main)
        main.__pivotChanged = true
        GizmoSystem.mainEntity = main
        GizmoSystem.targetGizmo.transformGizmo()
        GizmoSystem.targetRotation = main.rotationQuaternionFinal
        RotationGizmo.currentRotation.fill(0)
    }

    static #initialized = false
    static initialize() {
        if (GizmoSystem.#initialized)
            return
        GizmoSystem.#initialized = true

        GizmoSystem.translationGizmo = new TranslationGizmo()
        GizmoSystem.scaleGizmo = new ScalingGizmo()
        GizmoSystem.rotationGizmo = new RotationGizmo()
        GizmoSystem.targetGizmo = GizmoSystem.translationGizmo
    }


    static execute() {
        const m = GizmoSystem.mainEntity
        if (m != null) {

            const axis = GizmoSystem.clickedAxis
            GizmoSystem.highlightX = axis === AXIS.X || axis === AXIS.XZ || axis === AXIS.XY || axis === AXIS.SCREEN_SPACE
            GizmoSystem.highlightY = axis === AXIS.Y || axis === AXIS.ZY || axis === AXIS.XY || axis === AXIS.SCREEN_SPACE
            GizmoSystem.highlightZ = axis === AXIS.Z || axis === AXIS.ZY || axis === AXIS.XZ || axis === AXIS.SCREEN_SPACE

            getPivotPointMatrix(m)
            const t = GizmoSystem.targetGizmo
            if (t) {
                if (t !== GizmoSystem.rotationGizmo)
                    ScreenSpaceGizmo.drawGizmo()
                t.drawGizmo()
                mat4.identity(lineMatrix)
                GizmoAPI.applyTransformation(lineMatrix, NULL_QUAT, NULL_VEC3, NULL_VEC3_1)
            }

            LineRenderer.setState(0, 0, LINE_SIZE)
            if (GizmoSystem.highlightX) LineRenderer.drawX(lineMatrix)
            if (GizmoSystem.highlightY) LineRenderer.drawY(lineMatrix)
            if (GizmoSystem.highlightZ) LineRenderer.drawZ(lineMatrix)
            LineRenderer.finish()
        } else
            GizmoSystem.hasStarted = false
    }


}
