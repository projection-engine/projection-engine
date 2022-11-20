import GridSystem from "./runtime/GridSystem"
import IconsSystem from "./runtime/IconsSystem"
import GizmoSystem from "./runtime/GizmoSystem"
import SelectedSystem from "./runtime/SelectedSystem"
import BackgroundSystem from "./runtime/BackgroundSystem"
import Engine from "../../../public/engine/Engine";
import CameraTracker from "./lib/CameraTracker";
import CollisionVisualizationSystem from "./runtime/CollisionVisualizationSystem";
import getPivotPointMatrix from "./utils/get-pivot-point-matrix";
import BufferVisualization from "./runtime/BufferVisualization";


let selected = []
export default class Wrapper {
    static selected = selected
    static selectionMap = new Map()


    static updateSelectionData(data) {
        Wrapper.selectionMap.clear()
        selected = []
        Wrapper.selected = selected
        data.forEach(d => {
            const c = Engine.entitiesMap.get(d)
            if (c) {
                selected.push(c)
                Wrapper.selectionMap.set(d, true)
            }
        })

        const main = Wrapper.selected[0]
        if (main) {
            getPivotPointMatrix(main)
            main.__pivotChanged = true
            GizmoSystem.mainEntity = main
            GizmoSystem.targetGizmo.transformGizmo()
            GizmoSystem.targetRotation = main._rotationQuat
        } else {
            GizmoSystem.targetRotation = undefined
            GizmoSystem.mainEntity = undefined
            GizmoSystem.hasStarted = false
        }
    }

    static beforeDrawing() {
        CameraTracker.updateFrame()
        SelectedSystem.drawToBuffer(selected)
    }

    static duringDrawing() {
        BackgroundSystem.execute()
        GridSystem.execute()
    }

    static afterDrawing() {
        gpu.enable(gpu.BLEND)
        gpu.blendFunc(gpu.SRC_ALPHA, gpu.ONE_MINUS_SRC_ALPHA)
        SelectedSystem.drawSilhouette(selected)
        if (Engine.params.iconsVisibility) {
            IconsSystem.execute(selected)
            CollisionVisualizationSystem.execute(selected)
        }

        GizmoSystem.execute()

        if(Engine.params.visibleBuffers)
            BufferVisualization.execute()
    }
}