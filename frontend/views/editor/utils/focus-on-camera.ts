import EngineStore from "../stores/EngineStore";
import Engine from "../../../../engine-core/Engine";
import SelectionStore from "../stores/SelectionStore";
import EntityStateController from "../lib/controllers/EntityStateController";
import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI";
import CameraTracker from "../../../../engine-tools/lib/CameraTracker";
import Entity from "../../../../engine-core/instances/Entity";

export default function focusOnCamera(cameraTarget) {
    const focused = EngineStore.engine.focusedCamera
    const isCamera = cameraTarget instanceof Entity
    if (!focused || isCamera && cameraTarget.id !== focused) {
        const current = isCamera ? cameraTarget : Engine.entitiesMap.get(SelectionStore.mainEntity)
        if (current && current.cameraComponent) {
            EntityStateController.cameraSerialization = CameraAPI.serializeState()
            CameraTracker.stopTracking()
            CameraAPI.updateViewTarget(current)
            EngineStore.updateStore({...EngineStore.engine, focusedCamera: current.id})
        }
    } else {
        CameraAPI.restoreState(EntityStateController.cameraSerialization)
        CameraTracker.startTracking()
        EngineStore.updateStore({...EngineStore.engine, focusedCamera: undefined})
    }
}