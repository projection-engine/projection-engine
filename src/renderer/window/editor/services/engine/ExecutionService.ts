import EngineStore from "../../../shared/stores/EngineStore"
import EditorCameraSystem from "../../../../engine/tools/systems/EditorCameraSystem"
import UIManager from "@engine-core/managers/UIManager"
import Engine from "../../../../engine/core/Engine"
import CameraManager from "@engine-core/managers/CameraManager"
import ScriptsManager from "@engine-core/managers/ScriptsManager"
import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"
import EditorLevelService from "./EditorLevelService"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
import {Environment,} from "@engine-core/engine.enum";
import EngineState from "@engine-core/states/EngineState";
import EntityManager from "@engine-core/managers/EntityManager";
import LevelManager from "@engine-core/managers/LevelManager";

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

		ExecutionService.cameraSerialization = CameraManager.serializeState()
		ExecutionService.#isPlaying = true
		EditorCameraSystem.stopTracking()
		await EditorLevelService.getInstance().saveCurrentLevel().catch(console.error)
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

		UIManager.destroyUI()
		await EditorLevelService.getInstance().loadLevel(ExecutionService.#currentLevelID).catch(console.error)
		await ScriptsManager.updateAllScripts()

		EngineState.cameraEntityTarget = undefined
		EditorCameraSystem.startTracking()
		EngineStore.updateStore({executingAnimation: false})
		CameraManager.restoreState(ExecutionService.cameraSerialization)
	}

}
