import {mat4, quat, vec3} from "gl-matrix"
import TRANSFORMATION_TYPE from "../../../frontend/static/TRANSFORMATION_TYPE"
import mapGizmoMesh from "../../utils/map-gizmo-mesh"
import PickingAPI from "../../../engine-core/lib/utils/PickingAPI";
import CameraAPI from "../../../engine-core/lib/utils/CameraAPI";
import GizmoSystem from "../../runtime/GizmoSystem";
import AXIS from "../../static/AXIS";
import ScreenSpaceGizmo from "./ScreenSpaceGizmo";
import GPU from "../../../engine-core/GPU";
import EngineTools from "../../EngineTools";
import UndoRedoAPI from "../../../frontend/editor/lib/utils/UndoRedoAPI";
import gizmoRotateEntity from "../../utils/gizmo-rotate-entity";
import drawGizmoToDepth from "../../utils/draw-gizmo-to-depth";
import GizmoInterface from "../GizmoInterface";
import StaticEditorMeshes from "../StaticEditorMeshes";
import StaticEditorShaders from "../StaticEditorShaders";
import Entity from "../../../engine-core/instances/Entity";

const toRad = Math.PI / 180
const uniformCache = new Float32Array(4)
const cacheVec3 = vec3.create()
export default class RotationGizmo extends GizmoInterface {
    tracking = false
    static currentRotation: vec3 = vec3.create()
    static gridSize: number = toRad
    static currentIncrement = 0

    constructor() {
        super()
        this.xGizmo = mapGizmoMesh("x", "ROTATION")
        this.yGizmo = mapGizmoMesh("y", "ROTATION")
        this.zGizmo = mapGizmoMesh("z", "ROTATION")
    }

    onMouseDown(event: MouseEvent) {
        this.x = event.clientX
        this.y = event.clientY

        RotationGizmo.currentIncrement = 0
        this.#testClick()
    }

    onMouseUp() {
        if (GizmoSystem.hasStarted) {
            GizmoSystem.hasStarted = false
            UndoRedoAPI.save(EngineTools.selected)
        }

        document.exitPointerLock()
        GizmoSystem.clickedAxis = -1
        this.tracking = false
    }


    onMouseMove(event: MouseEvent) {
        if (!GizmoSystem.mainEntity)
            return
        if (!GizmoSystem.hasStarted) {
            GizmoSystem.hasStarted = true
            UndoRedoAPI.save(EngineTools.selected)
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
                const position = vec3.add(cacheVec3, RotationGizmo.currentRotation, ScreenSpaceGizmo.onMouseMove(event))
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
        drawGizmoToDepth(StaticEditorMeshes.rotationGizmo, [
            this.xGizmo.matrix,
            this.yGizmo.matrix,
            this.zGizmo.matrix,
        ])
        const pickID = PickingAPI.readEntityID(this.x, this.y)
        GizmoSystem.clickedAxis = pickID

        if (pickID === 0)
            this.onMouseUp()
        else {
            GizmoSystem.wasOnGizmo = true
            this.tracking = true
            GPU.canvas.requestPointerLock()
        }
    }

    #rotateGizmo(entity: Entity) {
        const m = GizmoSystem.mainEntity
        if (!m)
            return
        const matrix = entity.matrix
        mat4.copy(matrix, entity.__cacheMatrix)

        matrix[12] += m.__pivotOffset[0]
        matrix[13] += m.__pivotOffset[1]
        matrix[14] += m.__pivotOffset[2]
    }

    transformGizmo() {
        if (!GizmoSystem.mainEntity)
            return
        this.#rotateGizmo(this.xGizmo)
        this.#rotateGizmo(this.yGizmo)
        this.#rotateGizmo(this.zGizmo)
    }

    drawGizmo() {
        if (!GizmoSystem.mainEntity)
            return
        if (this.tracking && GizmoSystem.clickedAxis === AXIS.X || !this.tracking)
            RotationGizmo.#draw(this.xGizmo.matrix, AXIS.X)
        if (this.tracking && GizmoSystem.clickedAxis === AXIS.Y || !this.tracking)
            RotationGizmo.#draw(this.yGizmo.matrix, AXIS.Y)
        if (this.tracking && GizmoSystem.clickedAxis === AXIS.Z || !this.tracking)
            RotationGizmo.#draw(this.zGizmo.matrix, AXIS.Z)
    }

    static #draw(transformMatrix, axis) {
        StaticEditorShaders.rotation.bind()
        const uniforms = StaticEditorShaders.rotationUniforms
        const context = GPU.context

        context.uniformMatrix4fv(uniforms.transformMatrix, false, transformMatrix)
        context.uniform3fv(uniforms.translation, GizmoSystem.mainEntity.__pivotOffset)
        context.uniform1i(uniforms.cameraIsOrthographic, CameraAPI.notificationBuffers[2])

        uniformCache[0] = axis
        uniformCache[1] = GizmoSystem.clickedAxis
        uniformCache[2] = RotationGizmo.currentRotation[axis - 2]
        uniformCache[3] = RotationGizmo.gridSize * toRad
        context.uniform4fv(uniforms.metadata, uniformCache)

        StaticEditorMeshes.rotationGizmo.draw()
    }
}
