import ENVIRONMENT from "../../../../engine/core/static/ENVIRONMENT"

import EngineStore from "../../../shared/stores/EngineStore"
import CameraTracker from "../../../../engine/tools/utils/CameraTracker"
import UIAPI from "../../../../engine/core/lib/rendering/UIAPI"
import Engine from "../../../../engine/core/Engine"
import CameraAPI from "../../../../engine/core/lib/utils/CameraAPI"
import ScriptsAPI from "../../../../engine/core/lib/utils/ScriptsAPI"
import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"

import ResourceEntityMapper from "../../../../engine/core/resource-libs/ResourceEntityMapper"
import LevelService from "./LevelService"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"

export default class ExecutionService {
	static #currentLevelID
	static #isPlaying = false
	static cameraSerialization

	static async startPlayState() {
		if (ExecutionService.#isPlaying || !Engine.loadedLevel) {
			ToastNotificationSystem.getInstance().error(LocalizationEN.NO_LEVEL_LOADED)
			return
		}
		ToastNotificationSystem.getInstance().warn(LocalizationEN.SAVING_STATE)

		ExecutionService.cameraSerialization = CameraAPI.serializeState()
		ExecutionService.#isPlaying = true
		CameraTracker.stopTracking()
		await LevelService.getInstance().saveCurrentLevel().catch(console.error)
		ExecutionService.#currentLevelID = Engine.loadedLevel.id
		await Engine.startSimulation()
		EngineStore.updateStore({focusedCamera: undefined, executingAnimation: true})
	}

	static async stopPlayState() {
		if (!ExecutionService.#isPlaying)
			return
		ResourceEntityMapper.clear()

		Engine.entities.clear()
		Engine.queryMap.clear()

		ToastNotificationSystem.getInstance().log(LocalizationEN.RESTORING_STATE)
		ExecutionService.#isPlaying = false
		Engine.environment = ENVIRONMENT.DEV

		UIAPI.destroyUI()
		await LevelService.getInstance().loadLevel(ExecutionService.#currentLevelID).catch(console.error)
		await ScriptsAPI.updateAllScripts()

		CameraAPI.trackingEntity = undefined
		CameraTracker.startTracking()
		EngineStore.updateStore({executingAnimation: false})
		CameraAPI.restoreState(ExecutionService.cameraSerialization)
	}

}