import AbstractSystem from "../AbstractSystem";
import CameraManager from "../managers/CameraManager";
import GPU from "../GPU";
import TransformationManager from "../managers/TransformationManager";
import LightsManager from "../managers/LightsManager";
import EngineState from "../states/EngineState";

export default class PreLoopSystem extends AbstractSystem{
    #previousTimestamp = 0

    execute() {
        const current = EngineState.currentTimeStamp
        EngineState.elapsed = current - this.#previousTimestamp
        this.#previousTimestamp = current
        CameraManager.updateUBOs()
        GPU.context.clear(GPU.context.COLOR_BUFFER_BIT | GPU.context.DEPTH_BUFFER_BIT)
        if (TransformationManager.hasChangeBuffer[0] === 1) {
            LightsManager.packageLights(false, true)
        }
    }
}
