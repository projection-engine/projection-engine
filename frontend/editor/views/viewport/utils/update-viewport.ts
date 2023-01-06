import VIEWPORT_TABS from "../../../static/VIEWPORT_TABS";
import Engine from "../../../../../engine-core/Engine";
import CameraTracker from "../../../../../engine-tools/lib/CameraTracker";
import GPU from "../../../../../engine-core/GPU";
import ViewTabItem from "../../../static/ViewTabItem";


export default function updateViewport(engine, currentView:ViewTabItem) {
    if (!engine.isReady || engine.focusedCamera)
        return
    if (currentView.type === VIEWPORT_TABS.EDITOR) {
        Engine.start()
        if (Engine.isDev)
            CameraTracker.startTracking()
        GPU.canvas.style.opacity = "1"
    } else {
        CameraTracker.stopTracking()
        Engine.stop()
        GPU.canvas.style.opacity = "0"
    }
}