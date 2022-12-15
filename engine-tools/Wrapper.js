import GridSystem from "./runtime/GridSystem"
import IconsSystem from "./runtime/IconsSystem"
import GizmoSystem from "./runtime/GizmoSystem"
import SelectedSystem from "./runtime/SelectedSystem"
import Engine from "../engine-core/Engine";
import CameraTracker from "./lib/CameraTracker";
import CollisionVisualizationSystem from "./runtime/CollisionVisualizationSystem";
import SettingsStore from "../frontend/editor/stores/SettingsStore";


let selected = [], settings
export default class Wrapper {
    static selected = selected
    static selectionMap = new Map()


    static updateSelectionData(data) {
        Wrapper.selectionMap.clear()
        for(let i = 0; i < selected.length; i++)
            selected[i].__isSelected = false
        selected = []
        Wrapper.selected = selected


        data.forEach(d => {
            const c = Engine.entitiesMap.get(d)
            if (c) {
                selected.push(c)
                c.__isSelected = true
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

    static afterDrawing() {
        CameraTracker.updateFrame()
        settings = SettingsStore.data

        gpu.disable(gpu.CULL_FACE)
        gpu.disable(gpu.DEPTH_TEST)
        if(settings.showGrid)
            GridSystem.execute()
        CollisionVisualizationSystem.execute(selected)
        SelectedSystem.drawSilhouette(selected, settings)
        IconsSystem.drawIcons(settings)
        gpu.enable(gpu.DEPTH_TEST)
        gpu.clear(gpu.DEPTH_BUFFER_BIT)

        GizmoSystem.execute()
        gpu.enable(gpu.CULL_FACE)
    }
}