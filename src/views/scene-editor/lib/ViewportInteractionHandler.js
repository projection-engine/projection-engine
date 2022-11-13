import GizmoSystem from "../../../lib/engine-tools/runtime/GizmoSystem";
import Engine from "../../../../public/engine/Engine";
import onViewportClick from "../../viewport/utils/on-viewport-click";
import SelectionStore from "../../../stores/SelectionStore";
import SettingsStore from "../../../stores/SettingsStore";


const LEFT_BUTTON = 0

export default class ViewportInteractionHandler {
    static mouseDelta = {x: 0, y: 0}

    static initialize() {
        const parentElement = gpu.canvas
        parentElement.addEventListener("mousedown", ViewportInteractionHandler.onMouseDown)
        parentElement.addEventListener("mouseup", ViewportInteractionHandler.onMouseUp)
    }

    static destroy() {
        const parentElement = gpu.canvas
        parentElement.removeEventListener("mousedown", ViewportInteractionHandler.onMouseDown)
        parentElement.removeEventListener("mouseup", ViewportInteractionHandler.onMouseUp)
    }

    static gizmoMouseMove(event) {
        if (GizmoSystem.targetGizmo)
            GizmoSystem.targetGizmo.onMouseMove(event)
    }

    static onMouseDown(e) {
        if (!Engine.isReady || e.button !== LEFT_BUTTON)
            return
        ViewportInteractionHandler.mouseDelta = {x: e.clientX, y: e.clientY}
        if (GizmoSystem.targetGizmo) {
            GizmoSystem.targetGizmo.onMouseDown(e)
            e.currentTarget.targetGizmo = GizmoSystem.targetGizmo
            document.addEventListener("mousemove", ViewportInteractionHandler.gizmoMouseMove)
        }
    }

    static onMouseUp(event) {
        if (GizmoSystem.targetGizmo) {
            GizmoSystem.targetGizmo.onMouseUp()
            document.removeEventListener("mousemove", ViewportInteractionHandler.gizmoMouseMove)
        }
        if (!Engine.isReady)
            return
        onViewportClick(
            event,
            ViewportInteractionHandler.mouseDelta,
            SettingsStore.data,
            (data) => {
                if (GizmoSystem.wasOnGizmo) {
                    GizmoSystem.wasOnGizmo = false
                    return
                }
                SelectionStore.engineSelected = data
            })
    }
}