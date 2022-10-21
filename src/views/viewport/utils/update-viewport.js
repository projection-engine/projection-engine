import FilesStore from "../../../stores/FilesStore";
import VIEWPORT_TABS from "../../../data/VIEWPORT_TABS";
import {Engine} from "../../../../public/engine/production";
import {CameraTracker} from "../../../../public/engine/editor";

export default function updateViewport(engine, currentView) {

    console.trace(engine.isReady, currentView)
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