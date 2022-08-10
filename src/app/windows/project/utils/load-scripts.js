import DataStoreController from "../stores/DataStoreController";
import componentConstructor from "../libs/component-constructor";
import ENVIRONMENT from "../libs/engine/data/ENVIRONMENT";
import Renderer from "../libs/engine/Renderer";

const {shell} = window.require("electron")

export default async function loadScripts(engine) {
    const newValue = !engine.executingAnimation
    DataStoreController.updateEngine({...engine, executingAnimation: newValue})
    if(newValue)
    Renderer.environment = ENVIRONMENT.EXECUTION
    const entities = window.renderer.entities
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