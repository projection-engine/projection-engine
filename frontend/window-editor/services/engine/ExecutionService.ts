import ENVIRONMENT from "../../../../engine-core/static/ENVIRONMENT"

import EngineStore from "../../../shared/stores/EngineStore"
import CameraTracker from "../../../../engine-core/tools/lib/CameraTracker"
import UIAPI from "../../../../engine-core/lib/rendering/UIAPI"
import Engine from "../../../../engine-core/Engine"
import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI"
import ScriptsAPI from "../../../../engine-core/lib/utils/ScriptsAPI"
import AlertController from "../../../shared/components/alert/AlertController"

import ResourceEntityMapper from "../../../../engine-core/resource-libs/ResourceEntityMapper"
import LevelService from "./LevelService"
import LocalizationEN from "../../../../contants/LocalizationEN";

export default class ExecutionService {
	static #currentLevelID
	static #isPlaying = false
	static cameraSerialization

	static async startPlayState() {
		if (ExecutionService.#isPlaying || !Engine.loadedLevel) {
			AlertController.error(LocalizationEN.NO_LEVEL_LOADED)
			return
		}
		AlertController.warn(LocalizationEN.SAVING_STATE)

		ExecutionService.cameraSerialization = CameraAPI.serializeState()
		ExecutionService.#isPlaying = true
		CameraTracker.stopTracking()
		await LevelService.saveCurrentLevel().catch()
		ExecutionService.#currentLevelID = Engine.loadedLevel.id
		await Engine.startSimulation()
		EngineStore.updateStore({...EngineStore.engine, focusedCamera: undefined, executingAnimation: true})
	}

	static async stopPlayState() {
		if (!ExecutionService.#isPlaying)
			return
		ResourceEntityMapper.clear()

		Engine.entities.clear()
		Engine.queryMap.clear()

		AlertController.log(LocalizationEN.RESTORING_STATE)
		ExecutionService.#isPlaying = false
		Engine.environment = ENVIRONMENT.DEV

		UIAPI.destroyUI()
		await LevelService.loadLevel(ExecutionService.#currentLevelID).catch()
		await ScriptsAPI.updateAllScripts()

		CameraAPI.trackingEntity = undefined
		CameraTracker.startTracking()
		EngineStore.updateStore({...EngineStore.engine, executingAnimation: false})
		CameraAPI.restoreState(ExecutionService.cameraSerialization)
	}

}