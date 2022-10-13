import FilesStore from "../../../stores/FilesStore";
import VIEWPORT_TABS from "../../../data/VIEWPORT_TABS";
import {Engine} from "../../../../public/engine/production";
import {CameraTracker} from "../../../../public/engine/editor";

export default function updateViewport(engine, isReady, currentView) {

    if (!isReady)
        return
    if (!engine.executingAnimation) {
        if(currentView === VIEWPORT_TABS.UI)
            FilesStore.watchFiles()
        if (currentView === VIEWPORT_TABS.EDITOR || currentView === VIEWPORT_TABS.TERRAIN) {
            Engine.start()
            CameraTracker.startTracking()
            gpu.canvas.style.opacity = "1"
            return
        }
        CameraTracker.stopTracking()
        Engine.stop()
        gpu.canvas.style.opacity = "0"
        return
    }
    FilesStore.unwatchFiles()
    CameraTracker.stopTracking()
    Engine.start()
    gpu.canvas.style.opacity = "1"
    gpu.canvas.style.width = "100%"
}