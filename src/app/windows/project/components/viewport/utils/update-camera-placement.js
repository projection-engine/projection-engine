import CameraAPI from "../../../../../../../public/engine/production/apis/CameraAPI";
import CameraTracker from "../../../../../../../public/engine/editor/libs/CameraTracker";

export default function updateCameraPlacement(yaw, pitch) {
    CameraAPI.updateProjection()
    CameraTracker.yaw = yaw
    CameraTracker.pitch = pitch
    CameraTracker.update()
}