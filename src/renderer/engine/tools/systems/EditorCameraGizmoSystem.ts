import AbstractSystem from "../../core/AbstractSystem";
import CameraManager from "@engine-core/managers/CameraManager";

export default class EditorCameraGizmoSystem extends AbstractSystem {
    static gizmoRef: HTMLElement

    shouldExecute(): boolean {
        return CameraManager.hasChangedView && EditorCameraGizmoSystem.gizmoRef != null;
    }

    execute() {
        EditorCameraGizmoSystem.gizmoRef.style.transform = `translateZ(calc(var(--cube-size) * -3)) matrix3d(${CameraManager.staticViewMatrix})`
    }
}
