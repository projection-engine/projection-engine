import ENVIRONMENT from "../../public/engine/static/ENVIRONMENT";
import componentConstructor from "../utils/component-constructor";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import EngineStore from "../stores/EngineStore";
import CameraTracker from "../../public/engine/editor-environment/libs/CameraTracker";
import UIAPI from "../../public/engine/api/UIAPI";
import PhysicsAPI from "../../public/engine/api/PhysicsAPI";
import Engine from "../../public/engine/Engine";
import serializeStructure from "../../public/engine/utils/serialize-structure";
import EntityAPI from "../../public/engine/api/EntityAPI";

export default class EntityStateController {
    static #state = []
    static #isPlaying = false

    static async startPlayState() {
        if (EntityStateController.#isPlaying)
            return
        EntityStateController.#isPlaying = true
        CameraTracker.stopTracking()
        Engine.environment = ENVIRONMENT.EXECUTION
        alert.pushAlert("Saving state", "alert")

        EntityStateController.#state = Engine.entities.map(e => serializeStructure(e.serializable()))

        const engine = EngineStore.engine
        const entities = Engine.entities

        try {
            for (let i = 0; i < entities.length; i++) {
                const current = entities[i]
                PhysicsAPI.registerRigidBody(current)
                for (let s = 0; s < current.scripts.length; s++)
                    await componentConstructor(current, current.scripts[s]?.id, false)
            }
        } catch (err) {
            console.error(err)
        }

        UIAPI.buildUI()
        EngineStore.updateStore({...engine, executingAnimation: true})

    }

    static async stopPlayState() {
        if (!EntityStateController.#isPlaying)
            return
        EntityStateController.#isPlaying = false
        Engine.environment = ENVIRONMENT.DEV

        alert.pushAlert("Restoring state", "alert")
        const mapped = []

        const entities = Engine.entities

        try {
            for (let i = 0; i < entities.length; i++) {
                const current = entities[i]
                PhysicsAPI.removeRigidBody(current)
                for (let s = 0; s < current.scripts.length; s++)
                    await componentConstructor(current, current.scripts[s]?.id, false)
            }
        } catch (err) {
            console.error(err)
        }


        for (let i = 0; i < EntityStateController.#state.length; i++) {
            const entity = EntityAPI.parseEntityObject(JSON.parse(EntityStateController.#state[i]))
            for (let i = 0; i < entity.scripts.length; i++)
                await componentConstructor(entity, entity.scripts[i].id, false)
            mapped.push(entity)
        }
        EntityStateController.#state = []
        dispatchRendererEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})

        UIAPI.destroyUI()
        if( UIAPI.uiMountingPoint?.parentNode) {
            UIAPI.uiMountingPoint.parentNode.removeChild(UIAPI.uiMountingPoint)
            UIAPI.uiMountingPoint = undefined
        }

        CameraTracker.startTracking()
        EngineStore.updateStore({...EngineStore.engine, executingAnimation: false})

    }

}