import VIEWPORT_TABS from "../../../static/VIEWPORT_TABS";
import Engine from "../../../../../../engine-core/Engine";
import CameraTracker from "../../../../../../engine-tools/lib/CameraTracker";
import ViewTabItem from "../../../static/ViewTabItem";


export default function updateViewport(engine, currentView:ViewTabItem) {
    if (!engine.isReady || engine.focusedCamera)
        return
    if (currentView.type === VIEWPORT_TABS.EDITOR) {

        CameraTracker.startTracking()
        Engine.start()
    } else {
        CameraTracker.stopTracking()
        Engine.stop()
    }
}