import EngineStore from "../stores/EngineStore";
import Engine from "../../public/engine/Engine";
import SelectionStore from "../stores/SelectionStore";
import EntityStateController from "../lib/EntityStateController";
import CameraAPI from "../../public/engine/lib/utils/CameraAPI";
import CameraTracker from "../../public/engine/editor-environment/lib/CameraTracker";
import COMPONENTS from "../../public/engine/static/COMPONENTS";
import Entity from "../../public/engine/instances/Entity";

export default function focusOnCamera(cameraTarget) {
    const focused = EngineStore.engine.focusedCamera
    const isCamera = cameraTarget instanceof Entity
    if (!focused || isCamera && cameraTarget.id !== focused) {
        const current = isCamera ? cameraTarget : Engine.entitiesMap.get(SelectionStore.mainEntity)
        if (current && current.components.get(COMPONENTS.CAMERA)) {
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