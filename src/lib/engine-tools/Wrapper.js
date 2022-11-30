import GridSystem from "./runtime/GridSystem"
import IconsSystem from "./runtime/IconsSystem"
import GizmoSystem from "./runtime/GizmoSystem"
import SelectedSystem from "./runtime/SelectedSystem"
import Engine from "../../../public/engine/Engine";
import CameraTracker from "./lib/CameraTracker";
import CollisionVisualizationSystem from "./runtime/CollisionVisualizationSystem";
import getPivotPointMatrix from "./utils/get-pivot-point-matrix";
import SettingsStore from "../../stores/SettingsStore";


let selected = [], settings
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
        if (main)
            GizmoSystem.linkEntityToGizmo(main)
        else {
            GizmoSystem.targetRotation = undefined
            GizmoSystem.mainEntity = undefined
            GizmoSystem.hasStarted = false
        }
    }

    static beforeDrawing() {
        CameraTracker.updateFrame()
        settings = SettingsStore.data
        if (!settings.overlays) return
        GridSystem.execute()
    }


    static afterDrawing() {

        if (!settings.overlays) return

        IconsSystem.drawIcons()
        CollisionVisualizationSystem.execute(selected)

        SelectedSystem.drawSilhouette(selected)
        gpu.clear(gpu.DEPTH_BUFFER_BIT)
        GizmoSystem.execute()
        IconsSystem.drawPoints(selected)

    }
}