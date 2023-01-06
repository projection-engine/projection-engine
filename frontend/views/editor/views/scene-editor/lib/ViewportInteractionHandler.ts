import GizmoSystem from "../../../../../../engine-tools/runtime/GizmoSystem";
import Engine from "../../../../../../engine-core/Engine";
import onViewportClick from "../../viewport/utils/on-viewport-click";
import SelectionStore from "../../../stores/SelectionStore";
import SettingsStore from "../../../stores/SettingsStore";
import GPU from "../../../../../../engine-core/GPU";


const LEFT_BUTTON = 0

export default class ViewportInteractionHandler {
    static mouseDelta = {x: 0, y: 0}

    static initialize() {
        const parentElement = GPU.canvas
        parentElement.addEventListener("mousedown", ViewportInteractionHandler.onMouseDown)
        parentElement.addEventListener("mouseup", ViewportInteractionHandler.onMouseUp)
    }

    static destroy() {
        const parentElement = GPU.canvas
        parentElement.removeEventListener("mousedown", ViewportInteractionHandler.onMouseDown)
        parentElement.removeEventListener("mouseup", ViewportInteractionHandler.onMouseUp)
    }


    static onMouseDown(e) {
        if (!Engine.isReady || e.button !== LEFT_BUTTON)
            return
        ViewportInteractionHandler.mouseDelta = {x: e.clientX, y: e.clientY}

        GizmoSystem.targetGizmo.onMouseDown(e)
        document.addEventListener("mousemove", GizmoSystem.targetGizmo.onMouseMove)

    }

    static onMouseUp(event) {
        GizmoSystem.targetGizmo.onMouseUp()
        document.removeEventListener("mousemove", GizmoSystem.targetGizmo.onMouseMove)

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