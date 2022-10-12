import FilesStore from "../../../stores/FilesStore";
import VIEWPORT_TABS from "../../../data/VIEWPORT_TABS";
import {Engine} from "../../../../public/engine/production";
import {CameraTracker} from "../../../../public/engine/editor";

export default function updateViewport(engine, isReady, viewTab){
    if (isReady) {
        if (!engine.executingAnimation) {
            FilesStore.watchFiles()
            if (viewTab === VIEWPORT_TABS.EDITOR || viewTab === VIEWPORT_TABS.TERRAIN) {
                Engine.start()
                CameraTracker.startTracking()
                gpu.canvas.style.opacity = "1"
            } else {

                CameraTracker.stopTracking()
                Engine.stop()
                gpu.canvas.style.opacity = "0"
            }
        } else {
            FilesStore.unwatchFiles()
            CameraTracker.stopTracking()
            Engine.start()
            gpu.canvas.style.opacity = "1"
            gpu.canvas.style.width = "100%"
        }
    }
}