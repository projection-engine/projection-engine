import DataStoreController from "../stores/DataStoreController";
import componentConstructor from "../libs/component-constructor";

const {shell} = window.require("electron")

export default async function loadScripts(engine) {
    const newValue = !engine.executingAnimation
    const scripts = []
    const entities = window.renderer.entities
    try {
        if (newValue) {
            for (let i = 0; i < entities.length; i++) {
                const current = entities[i]
                for (let s = 0; s < current.scripts.length; s++)
                    await componentConstructor(current, current.scripts[s]?.id, false)
                }
        }
        DataStoreController.updateEngine({...engine, executingAnimation: newValue, scripts})
    } catch (err) {
        console.error(err)
        if (newValue)
            alert.pushAlert("Some error occurred", "error")
    }
}