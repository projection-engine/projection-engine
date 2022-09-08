import EngineStore from "../stores/EngineStore";
import componentConstructor from "../libs/component-constructor";
import ENVIRONMENT from "../libs/engine/production/data/ENVIRONMENT";
import Engine from "../libs/engine/production/Engine";
import UserInterfaceController from "../libs/engine/production/controllers/UserInterfaceController";

export default async function loadScripts() {
    const engine = EngineStore.engine
    const newValue = !engine.executingAnimation
    EngineStore.updateStore({...engine, executingAnimation: newValue})
    if (newValue)
        Engine.environment = ENVIRONMENT.EXECUTION
    const entities = [...Array.from(Engine.entitiesMap.values()), ...Array.from(UserInterfaceController.entities.values())]
    try {
        if (newValue) {
            for (let i = 0; i < entities.length; i++) {
                const current = entities[i]
                for (let s = 0; s < current.scripts.length; s++)
                    await componentConstructor(current, current.scripts[s]?.id, false)
            }
        }

    } catch (err) {
        console.error(err)
        if (newValue)
            alert.pushAlert("Some error occurred", "error")
    }
}