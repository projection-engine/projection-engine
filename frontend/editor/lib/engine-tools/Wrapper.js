import GridSystem from "./runtime/GridSystem"
import IconsSystem from "./runtime/IconsSystem"
import GizmoSystem from "./runtime/GizmoSystem"
import SelectedSystem from "./runtime/SelectedSystem"
import Engine from "../../../../public/engine/Engine";
import CameraTracker from "./lib/CameraTracker";
import CollisionVisualizationSystem from "./runtime/CollisionVisualizationSystem";
import SettingsStore from "../../stores/SettingsStore";
import STATIC_SHADERS from "../../../../public/engine/static/resources/STATIC_SHADERS";
import GPU from "../../../../public/engine/GPU";
import SSGI from "../../../../public/engine/runtime/rendering/SSGI";


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
        if (!settings.overlays) return
        gpu.disable(gpu.CULL_FACE)
        gpu.clear(gpu.DEPTH_BUFFER_BIT)
        GridSystem.execute()
        CollisionVisualizationSystem.execute(selected)
        SelectedSystem.drawSilhouette(selected)
        gpu.clear(gpu.DEPTH_BUFFER_BIT)
        IconsSystem.drawIcons(settings)
        GizmoSystem.execute()
        gpu.enable(gpu.CULL_FACE)
    }
}