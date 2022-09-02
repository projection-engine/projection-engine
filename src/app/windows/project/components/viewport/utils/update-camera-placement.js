import CameraAPI from "../../../libs/engine/production/libs/CameraAPI";
import CameraTracker from "../../../libs/engine/editor/libs/CameraTracker";

export default function updateCameraPlacement(yaw, pitch) {
    CameraAPI.updateProjection()
    CameraTracker.yaw = yaw
    CameraTracker.pitch = pitch
    CameraTracker.update()
}