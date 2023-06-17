import ENVIRONMENT from "../../../../engine-core/static/ENVIRONMENT"

import EngineStore from "../../../shared/stores/EngineStore"
import CameraTracker from "../../../../engine-core/tools/lib/CameraTracker"
import UIAPI from "../../../../engine-core/lib/rendering/UIAPI"
import Engine from "../../../../engine-core/Engine"
import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI"
import ScriptsAPI from "../../../../engine-core/lib/utils/ScriptsAPI"
import AlertController from "../../../shared/components/alert/AlertController"

import ResourceEntityMapper from "../../../../engine-core/resource-libs/ResourceEntityMapper"
import LevelController from "../utils/LevelController"
import LocalizationEN from "../../../../contants/LocalizationEN";

export default class ExecutionController {
	static #currentLevelID
	static #isPlaying = false
	static cameraSerialization

	static async startPlayState() {
		if (ExecutionController.#isPlaying || !Engine.loadedLevel) {
			AlertController.error(LocalizationEN.NO_LEVEL_LOADED)
			return
		}
		AlertController.warn(LocalizationEN.SAVING_STATE)

		ExecutionController.cameraSerialization = CameraAPI.serializeState()
		ExecutionController.#isPlaying = true
		CameraTracker.stopTracking()
		await LevelController.saveCurrentLevel().catch()
		ExecutionController.#currentLevelID = Engine.loadedLevel.id
		await Engine.startSimulation()
		EngineStore.updateStore({...EngineStore.engine, focusedCamera: undefined, executingAnimation: true})
	}

	static async stopPlayState() {
		if (!ExecutionController.#isPlaying)
			return
		ResourceEntityMapper.clear()

		Engine.entities.clear()
		Engine.queryMap.clear()

		AlertController.log(LocalizationEN.RESTORING_STATE)
		ExecutionController.#isPlaying = false
		Engine.environment = ENVIRONMENT.DEV

		UIAPI.destroyUI()
		await LevelController.loadLevel(ExecutionController.#currentLevelID).catch()
		await ScriptsAPI.updateAllScripts()

		CameraAPI.trackingEntity = undefined
		CameraTracker.startTracking()
		EngineStore.updateStore({...EngineStore.engine, executingAnimation: false})
		CameraAPI.restoreState(ExecutionController.cameraSerialization)
	}

}