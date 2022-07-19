export default function updateCameraPlacement(yaw, pitch) {
    window.renderer.camera.updateProjection()
    window.renderer.camera.yaw = yaw
    window.renderer.camera.pitch = pitch
    window.renderer.camera.updateViewMatrix()
}