import RendererStoreController from "../stores/RendererStoreController";
import componentConstructor from "../libs/component-constructor";
import ENVIRONMENT from "../libs/engine/production/data/ENVIRONMENT";
import RendererController from "../libs/engine/production/RendererController";
import UserInterfaceController from "../libs/engine/production/UserInterfaceController";

const {shell} = window.require("electron")

export default async function loadScripts() {
    const engine = RendererStoreController.engine
    const newValue = !engine.executingAnimation
    RendererStoreController.updateEngine({...engine, executingAnimation: newValue})
    if(newValue)
    RendererController.environment = ENVIRONMENT.EXECUTION
    const entities = [...Array.from(RendererController.entitiesMap.values()), ...Array.from(UserInterfaceController.entities.values())]
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