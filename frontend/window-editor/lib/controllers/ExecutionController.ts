import ENVIRONMENT from "../../../../engine-core/static/ENVIRONMENT";

import EngineStore from "../../../shared/stores/EngineStore";
import CameraTracker from "../../../../engine-tools/lib/CameraTracker";
import UIAPI from "../../../../engine-core/lib/rendering/UIAPI";
import Engine from "../../../../engine-core/Engine";
import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI";
import ScriptsAPI from "../../../../engine-core/lib/utils/ScriptsAPI";
import AlertController from "../../../shared/components/alert/AlertController";
import LOCALIZATION_EN from "../../../../static/objects/LOCALIZATION_EN";
import ResourceEntityMapper from "../../../../engine-core/resource-libs/ResourceEntityMapper";
import LevelController from "../utils/LevelController";

export default class ExecutionController {
    static #currentLevelID
    static #isPlaying = false
    static cameraSerialization

    static async startPlayState() {
        if (ExecutionController.#isPlaying || !Engine.loadedLevel) {
            AlertController.error(LOCALIZATION_EN.NO_LEVEL_LOADED)
            return
        }
        AlertController.warn(LOCALIZATION_EN.SAVING_STATE)

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

        AlertController.log(LOCALIZATION_EN.RESTORING_STATE)
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