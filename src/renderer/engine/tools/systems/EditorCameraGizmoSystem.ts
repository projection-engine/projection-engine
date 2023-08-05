import AbstractSystem from "../../core/AbstractSystem";
import CameraAPI from "../../core/lib/utils/CameraAPI";

export default class EditorCameraGizmoSystem extends AbstractSystem {
    static gizmoRef: HTMLElement

    shouldExecute(): boolean {
        return CameraAPI.hasChangedView && EditorCameraGizmoSystem.gizmoRef != null;
    }

    execute() {
        EditorCameraGizmoSystem.gizmoRef.style.transform = `translateZ(calc(var(--cube-size) * -3)) matrix3d(${CameraAPI.staticViewMatrix})`
    }
}
