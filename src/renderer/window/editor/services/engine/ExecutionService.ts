import EngineStore from "../../../shared/stores/EngineStore"
import EditorCameraSystem from "../../../../engine/tools/systems/EditorCameraSystem"
import UIAPI from "../../../../engine/core/lib/rendering/UIAPI"
import Engine from "../../../../engine/core/Engine"
import CameraAPI from "../../../../engine/core/lib/utils/CameraAPI"
import ScriptsAPI from "../../../../engine/core/lib/utils/ScriptsAPI"
import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"

import ResourceEntityMapper from "../../../../engine/core/resource-libs/ResourceEntityMapper"
import LevelService from "./LevelService"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
import {Environment,} from "@engine-core/engine.enum";
import EngineState from "@engine-core/EngineState";
import EntityManager from "@engine-core/EntityManager";
import LevelManager from "@engine-core/LevelManager";

export default class ExecutionService {
	static #currentLevelID
	static #isPlaying = false
	static cameraSerialization

	static async startPlayState() {
		if (ExecutionService.#isPlaying || !LevelManager.loadedLevel) {
			ToastNotificationSystem.getInstance().error(LocalizationEN.NO_LEVEL_LOADED)
			return
		}
		ToastNotificationSystem.getInstance().warn(LocalizationEN.SAVING_STATE)

		ExecutionService.cameraSerialization = CameraAPI.serializeState()
		ExecutionService.#isPlaying = true
		EditorCameraSystem.stopTracking()
		await LevelService.getInstance().saveCurrentLevel().catch(console.error)
		ExecutionService.#currentLevelID = LevelManager.loadedLevel
		await Engine.startSimulation()
		EngineStore.updateStore({focusedCamera: undefined, executingAnimation: true})
	}

	static async stopPlayState() {
		if (!ExecutionService.#isPlaying)
			return
		EntityManager.clear()

		ToastNotificationSystem.getInstance().log(LocalizationEN.RESTORING_STATE)
		ExecutionService.#isPlaying = false
		Engine.environment = Environment.DEV

		UIAPI.destroyUI()
		await LevelService.getInstance().loadLevel(ExecutionService.#currentLevelID).catch(console.error)
		await ScriptsAPI.updateAllScripts()

		EngineState.cameraEntityTarget = undefined
		EditorCameraSystem.startTracking()
		EngineStore.updateStore({executingAnimation: false})
		CameraAPI.restoreState(ExecutionService.cameraSerialization)
	}

}
