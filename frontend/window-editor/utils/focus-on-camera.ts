import EngineStore from "../../shared/stores/EngineStore";
import Engine from "../../../engine-core/Engine";
import SelectionStore from "../../shared/stores/SelectionStore";
import ExecutionController from "../lib/controllers/ExecutionController";
import CameraAPI from "../../../engine-core/lib/utils/CameraAPI";
import CameraTracker from "../../../engine-tools/lib/CameraTracker";
import Entity from "../../../engine-core/instances/Entity";

export default function focusOnCamera(cameraTarget) {
    const focused = EngineStore.engine.focusedCamera
    const isCamera = cameraTarget instanceof Entity
    if (!focused || isCamera && cameraTarget.id !== focused) {
        const current = isCamera ? cameraTarget : Engine.entities.get(SelectionStore.mainEntity)
        if (current && current.cameraComponent) {
            ExecutionController.cameraSerialization = CameraAPI.serializeState()
            CameraTracker.stopTracking()
            CameraAPI.updateViewTarget(current)
            EngineStore.updateStore({...EngineStore.engine, focusedCamera: current.id})
        }
    } else {
        CameraAPI.restoreState(ExecutionController.cameraSerialization)
        CameraTracker.startTracking()
        EngineStore.updateStore({...EngineStore.engine, focusedCamera: undefined})
    }
}