import EngineStore from "../../shared/stores/EngineStore"
import Engine from "../../../engine-core/Engine"
import SelectionStore from "../../shared/stores/SelectionStore"
import ExecutionService from "../services/engine/ExecutionService"
import CameraAPI from "../../../engine-core/lib/utils/CameraAPI"
import CameraTracker from "../../../engine-core/tools/lib/CameraTracker"
import Entity from "../../../engine-core/instances/Entity"

export default function focusOnCamera(cameraTarget) {
	const focused = EngineStore.engine.focusedCamera
	const isCamera = cameraTarget instanceof Entity
	if (!focused || isCamera && cameraTarget.id !== focused) {
		const current = isCamera ? cameraTarget : Engine.entities.get(SelectionStore.mainEntity)
		if (current && current.cameraComponent) {
			ExecutionService.cameraSerialization = CameraAPI.serializeState()
			CameraTracker.stopTracking()
			CameraAPI.updateViewTarget(current)
			EngineStore.updateStore({...EngineStore.engine, focusedCamera: current.id})
		}
	} else {
		CameraAPI.restoreState(ExecutionService.cameraSerialization)
		CameraTracker.startTracking()
		EngineStore.updateStore({...EngineStore.engine, focusedCamera: undefined})
	}
}