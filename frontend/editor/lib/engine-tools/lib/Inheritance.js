import {mat4} from "gl-matrix"
import GizmoSystem from "../runtime/GizmoSystem";
import AXIS from "../static/AXIS";
import DualAxisGizmo from "./transformation/DualAxisGizmo";
import GizmoAPI from "./GizmoAPI";
import PickingAPI from "../../../../../public/engine/lib/utils/PickingAPI";
import UndoRedoAPI from "../../utils/UndoRedoAPI";
import Wrapper from "../Wrapper";
import drawGizmoToDepth from "../utils/draw-gizmo-to-depth";

export default class Inheritance {
    tracking = false
    xGizmo
    yGizmo
    zGizmo
    xyz
    gridSize
    updateTransformationRealtime = false


    onMouseMove() {
        if (!GizmoSystem.hasStarted) {
            GizmoSystem.hasStarted = true
            UndoRedoAPI.save(Wrapper.selected)
            GizmoSystem.updateGizmoToolTip()
        }
    }

    onMouseDown(event) {
        this.x = event.clientX
        this.y = event.clientY
        GizmoSystem.targetGizmo.transformGizmo()
        this.#testClick()

    }


    onMouseUp() {
        if (GizmoSystem.hasStarted) {
            GizmoSystem.hasStarted = false
            UndoRedoAPI.save(Wrapper.selected)
        }
        this.tracking = false
        GizmoSystem.hasStarted = false
        document.exitPointerLock()
        GizmoSystem.clickedAxis = -1
        GizmoSystem.targetGizmo.transformGizmo()
    }


    #testClick() {
        if (!GizmoSystem.mainEntity)
            return
        this.transformGizmo()
        drawGizmoToDepth(this.xyz, [
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

    transformGizmo() {
        if (!GizmoSystem.mainEntity)
            return
        mat4.copy(this.xGizmo.matrix, this.xGizmo.__cacheMatrix)
        mat4.copy(this.yGizmo.matrix, this.yGizmo.__cacheMatrix)
        mat4.copy(this.zGizmo.matrix, this.zGizmo.__cacheMatrix)

        mat4.copy(DualAxisGizmo.gizmos.XY.matrix, DualAxisGizmo.gizmos.XY.__cacheMatrix)
        mat4.copy(DualAxisGizmo.gizmos.ZY.matrix, DualAxisGizmo.gizmos.ZY.__cacheMatrix)
        mat4.copy(DualAxisGizmo.gizmos.XZ.matrix, DualAxisGizmo.gizmos.XZ.__cacheMatrix)


        GizmoAPI.translateMatrix(this.xGizmo, true)
        GizmoAPI.translateMatrix(this.yGizmo, true)
        GizmoAPI.translateMatrix(this.zGizmo, true)
        GizmoAPI.translateMatrix(DualAxisGizmo.gizmos.XY, true)
        GizmoAPI.translateMatrix(DualAxisGizmo.gizmos.ZY, true)
        GizmoAPI.translateMatrix(DualAxisGizmo.gizmos.XZ, true)
    }

    drawGizmo() {
        if (!GizmoSystem.mainEntity)
            return

        DualAxisGizmo.drawGizmo()
        GizmoAPI.drawGizmo(this.xyz, this.xGizmo.matrix, AXIS.X)
        GizmoAPI.drawGizmo(this.xyz, this.yGizmo.matrix, AXIS.Y)
        GizmoAPI.drawGizmo(this.xyz, this.zGizmo.matrix, AXIS.Z)
    }
}
