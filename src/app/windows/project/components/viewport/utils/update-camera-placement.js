import CameraAPI from "../../../libs/engine/libs/apis/CameraAPI";
import CameraTracker from "../../../libs/engine-extension/libs/CameraTracker";

export default function updateCameraPlacement(yaw, pitch) {
    CameraAPI.updateProjection()
    CameraTracker.yaw = yaw
    CameraTracker.pitch = pitch
    CameraTracker.update()
}