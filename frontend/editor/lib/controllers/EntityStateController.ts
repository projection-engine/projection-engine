import ENVIRONMENT from "../../../../engine-core/static/ENVIRONMENT";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/dispatch-renderer-entities";
import EngineStore from "../../stores/EngineStore";
import CameraTracker from "../../../../engine-tools/lib/CameraTracker";
import UIAPI from "../../../../engine-core/lib/rendering/UIAPI";
import PhysicsAPI from "../../../../engine-core/lib/rendering/PhysicsAPI";
import Engine from "../../../../engine-core/Engine";
import serializeStructure from "../../../../engine-core/utils/serialize-structure";
import EntityAPI from "../../../../engine-core/lib/utils/EntityAPI";
import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI";
import ScriptsAPI from "../../../../engine-core/lib/utils/ScriptsAPI";
import MaterialAPI from "../../../../engine-core/lib/rendering/MaterialAPI";
import AlertController from "../../../components/alert/AlertController";
import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";

export default class EntityStateController {
    static #state = []
    static #isPlaying = false
    static cameraSerialization

    static async startPlayState() {
        if (EntityStateController.#isPlaying)
            return
        AlertController.warn(LOCALIZATION_EN.SAVING_STATE)

        EntityStateController.cameraSerialization = CameraAPI.serializeState()
        EntityStateController.#isPlaying = true
        CameraTracker.stopTracking()

        EntityStateController.#state = Engine.entities.map(e => serializeStructure(e.serializable()))
        await Engine.startSimulation()
        EngineStore.updateStore({...EngineStore.engine, focusedCamera: undefined, executingAnimation: true})
    }

    static async stopPlayState() {
        if (!EntityStateController.#isPlaying)
            return
        MaterialAPI.entityMaterial.clear()
        AlertController.log(LOCALIZATION_EN.RESTORING_STATE)
        EntityStateController.#isPlaying = false
        Engine.environment = ENVIRONMENT.DEV

        const mapped = []
        const entities = Engine.entities
        try {
            UIAPI.destroyUI()
            if (UIAPI.uiMountingPoint?.parentNode) {
                UIAPI.uiMountingPoint.parentNode.removeChild(UIAPI.uiMountingPoint)
                UIAPI.uiMountingPoint = undefined
            }
            for (let i = 0; i < entities.length; i++) {
                const current = entities[i]
                PhysicsAPI.removeRigidBody(current)
            }
        } catch (err) {
            console.error(err)
        }

        for (let i = 0; i < EntityStateController.#state.length; i++) {
            const entity = EntityAPI.parseEntityObject(JSON.parse(EntityStateController.#state[i]))
            mapped.push(entity)
        }

        EntityStateController.#state = []
        dispatchRendererEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})
        await ScriptsAPI.updateAllScripts()

        CameraAPI.trackingEntity = undefined
        CameraTracker.startTracking()
        EngineStore.updateStore({...EngineStore.engine, executingAnimation: false})
        CameraAPI.restoreState(EntityStateController.cameraSerialization)
    }

}