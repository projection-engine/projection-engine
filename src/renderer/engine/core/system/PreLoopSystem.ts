import AbstractSystem from "../AbstractSystem";
import CameraManager from "../managers/CameraManager";
import GPUState from "../states/GPUState";
import TransformationManager from "../managers/TransformationManager";
import LightsManager from "../managers/LightsManager";
import EngineState from "../states/EngineState";
import MetricsManager from "@engine-core/managers/MetricsManager";

export default class PreLoopSystem extends AbstractSystem{
    #previousTimestamp = 0

     execute = () => {
        const current = EngineState.currentTimeStamp
        EngineState.elapsed = current - this.#previousTimestamp
        this.#previousTimestamp = current
        CameraManager.updateUBOs()
        GPUState.context.clear(GPUState.context.COLOR_BUFFER_BIT | GPUState.context.DEPTH_BUFFER_BIT)
        if (TransformationManager.hasChangeBuffer[0] === 1) {
            LightsManager.packageLights(false, true)
        }
    }
}
