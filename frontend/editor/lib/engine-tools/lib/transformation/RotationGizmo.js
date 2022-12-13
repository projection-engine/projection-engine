import {mat4, quat, vec3} from "gl-matrix"
import TRANSFORMATION_TYPE from "../../../../static/TRANSFORMATION_TYPE"
import mapGizmoMesh from "../../utils/map-gizmo-mesh"
import PickingAPI from "../../../../../../public/engine/lib/utils/PickingAPI";
import CameraAPI from "../../../../../../public/engine/lib/utils/CameraAPI";
import GizmoSystem from "../../runtime/GizmoSystem";
import AXIS from "../../static/AXIS";
import ScreenSpaceGizmo from "./ScreenSpaceGizmo";
import GPU from "../../../../../../public/engine/GPU";
import STATIC_TEXTURES from "../../../../../../public/engine/static/resources/STATIC_TEXTURES";
import Wrapper from "../../Wrapper";
import UndoRedoAPI from "../../../utils/UndoRedoAPI";
import gizmoRotateEntity from "../../utils/gizmo-rotate-entity";
import drawGizmoToDepth from "../../utils/draw-gizmo-to-depth";

const toRad = Math.PI / 180

export default class RotationGizmo {
    tracking = false
    static currentRotation = [0, 0, 0]
    static gridSize = toRad
    static currentIncrement = 0
    static shader

    constructor() {

        this.xGizmo = mapGizmoMesh("x", "ROTATION")
        this.yGizmo = mapGizmoMesh("y", "ROTATION")
        this.zGizmo = mapGizmoMesh("z", "ROTATION")


        this.texture = GPU.textures.get(STATIC_TEXTURES.ROTATION_GIZMO)
    }

    onMouseDown(event) {
        this.x = event.clientX
        this.y = event.clientY

        RotationGizmo.currentIncrement = 0
        this.#testClick()
    }

    onMouseUp() {
        if (GizmoSystem.hasStarted) {
            GizmoSystem.hasStarted = false
            UndoRedoAPI.save(Wrapper.selected)
        }

        document.exitPointerLock()
        GizmoSystem.clickedAxis = -1
        this.tracking = false
    }


    onMouseMove(event) {
        if (!GizmoSystem.mainEntity)
            return
        if (!GizmoSystem.hasStarted) {
            GizmoSystem.hasStarted = true
            UndoRedoAPI.save(Wrapper.selected)
            GizmoSystem.updateGizmoToolTip()
        }

        const g = event.ctrlKey ? toRad : RotationGizmo.gridSize * toRad
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
                const position = vec3.add([], RotationGizmo.currentRotation, ScreenSpaceGizmo.onMouseMove(event, toRad, RotationGizmo.gridSize))
                gizmoRotateEntity(position, true)
                break
            default:
                break
        }
        GizmoSystem.hasStarted = true
    }

    #testClick() {
        if (!GizmoSystem.mainEntity)
            return
        drawGizmoToDepth(GizmoSystem.rotationGizmoMesh, [
            this.xGizmo.matrix,
            this.yGizmo.matrix,
            this.zGizmo.matrix,

        ])
        const pickID = PickingAPI.readEntityID(this.x, this.y)
        GizmoSystem.clickedAxis = pickID

        if (pickID === 0)
            this.onMouseUp(true)
        else {
            GizmoSystem.wasOnGizmo = true
            this.tracking = true
            gpu.canvas.requestPointerLock()
        }

    }

    #rotateGizmo(axis, entity) {
        const m = GizmoSystem.mainEntity
        if (!m)
            return
        const matrix = entity.matrix
        switch (axis) {
            case "x":
                mat4.copy(matrix, entity.__cacheMatrix)
                break
            case "y":
                mat4.copy(matrix, entity.__cacheMatrix)
                break
            case "z":
                mat4.copy(matrix, entity.__cacheMatrix)
                break
        }

        matrix[12] += m.__pivotOffset[0]
        matrix[13] += m.__pivotOffset[1]
        matrix[14] += m.__pivotOffset[2]

        if (GizmoSystem.transformationType === TRANSFORMATION_TYPE.GLOBAL && axis !== undefined) {
            switch (axis) {
                case "x":
                    mat4.rotateY(matrix, matrix, -RotationGizmo.currentRotation[0])
                    break
                case "y":
                    mat4.rotateY(matrix, matrix, RotationGizmo.currentRotation[1])
                    break
                case "z":
                    mat4.rotateY(matrix, matrix, RotationGizmo.currentRotation[2])
                    break
                default:
                    break
            }
        } else if (axis !== undefined && GizmoSystem.targetRotation)
            mat4.fromRotationTranslationScale(matrix, quat.multiply([], GizmoSystem.targetRotation, entity._rotationQuat), GizmoSystem.mainEntity.__pivotOffset, entity.scaling)
    }

    transformGizmo() {
        if (!GizmoSystem.mainEntity)
            return
        this.#rotateGizmo("x", this.xGizmo)
        this.#rotateGizmo("y", this.yGizmo)
        this.#rotateGizmo("z", this.zGizmo)
    }

    drawGizmo() {
        if (!GizmoSystem.mainEntity)
            return
        if (this.tracking && GizmoSystem.clickedAxis === AXIS.X || !this.tracking)
            this.#draw(this.xGizmo.matrix, AXIS.X, this.xGizmo.pickID)
        if (this.tracking && GizmoSystem.clickedAxis === AXIS.Y || !this.tracking)
            this.#draw(this.yGizmo.matrix, AXIS.Y, this.yGizmo.pickID)
        if (this.tracking && GizmoSystem.clickedAxis === AXIS.Z || !this.tracking)
            this.#draw(this.zGizmo.matrix, AXIS.Z, this.zGizmo.pickID)
    }

    #draw(transformMatrix, axis, id) {
        RotationGizmo.shader.bindForUse({
            transformMatrix,
            axis,
            translation: GizmoSystem.mainEntity.__pivotOffset,
            uID: [...id, 1],
            selectedAxis: GizmoSystem.clickedAxis,
            circleSampler: this.texture.texture,
            cameraIsOrthographic: CameraAPI.isOrthographic
        })
        GizmoSystem.rotationGizmoMesh.draw()
    }
}
