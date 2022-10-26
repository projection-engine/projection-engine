import VIEWPORT_TABS from "../../../data/VIEWPORT_TABS";
import Engine from "../../../../public/engine/Engine";
import CameraTracker from "../../../../public/engine/editor-environment/libs/CameraTracker";


export default function updateViewport(engine, currentView) {
    if (!engine.isReady)
        return
    if (currentView === VIEWPORT_TABS.EDITOR || currentView === VIEWPORT_TABS.TERRAIN) {
        Engine.start()
        CameraTracker.startTracking()
        gpu.canvas.style.opacity = "1"
    } else {
        CameraTracker.stopTracking()
        Engine.stop()
        gpu.canvas.style.opacity = "0"
    }
}