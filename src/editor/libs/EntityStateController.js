import {EntityAPI, Engine, Entity, ENVIRONMENT} from "../../../public/engine/production";


import componentConstructor from "./component-constructor";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import EngineStore from "../stores/EngineStore";
import CameraTracker from "../../../public/engine/editor/libs/CameraTracker";
import UIAPI from "../../../public/engine/production/apis/UIAPI";
import PhysicsPass from "../../../public/engine/production/passes/math/PhysicsPass";

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

        EntityStateController.#state = Engine.entities.map(e => Entity.serializeComplexObject(e.serializable()))

        const engine = EngineStore.engine
        const entities = Engine.entities

        try {
            for (let i = 0; i < entities.length; i++) {
                const current = entities[i]
                PhysicsPass.registerRigidBody(current)
                for (let s = 0; s < current.scripts.length; s++)
                    await componentConstructor(current, current.scripts[s]?.id, false)
            }
        } catch (err) {
            console.error(err)
            alert.pushAlert("Some error occurred", "error")
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
                PhysicsPass.registerRigidBody(current)
                for (let s = 0; s < current.scripts.length; s++)
                    await componentConstructor(current, current.scripts[s]?.id, false)
            }
        } catch (err) {
            console.error(err)
            alert.pushAlert("Some error occurred", "error")
        }


        for (let i = 0; i < EntityStateController.#state.length; i++) {
            const entity = Entity.parseEntityObject(JSON.parse(EntityStateController.#state[i]))
            for (let i = 0; i < entity.scripts.length; i++)
                await componentConstructor(entity, entity.scripts[i].id, false)
            mapped.push(entity)
        }
        EntityStateController.#state = []
        dispatchRendererEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})
        const engine = EngineStore.engine
        EngineStore.updateStore({...engine, executingAnimation: false})

        UIAPI.destroyUI()
        if( UIAPI.uiMountingPoint?.parentNode) {
            UIAPI.uiMountingPoint.parentNode.removeChild(UIAPI.uiMountingPoint)
            UIAPI.uiMountingPoint = undefined
        }

        CameraTracker.startTracking()
    }

}