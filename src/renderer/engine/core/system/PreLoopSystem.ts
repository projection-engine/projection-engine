import AbstractSystem from "../AbstractSystem";
import CameraAPI from "../lib/utils/CameraAPI";
import GPU from "../GPU";
import TransformationWorkerAPI from "../lib/utils/TransformationWorkerAPI";
import LightsAPI from "../lib/utils/LightsAPI";
import EngineState from "../states/EngineState";

export default class PreLoopSystem extends AbstractSystem{
    #previousTimestamp = 0

    execute() {
        const current = EngineState.currentTimeStamp
        EngineState.elapsed = current - this.#previousTimestamp
        this.#previousTimestamp = current
        CameraAPI.updateUBOs()
        GPU.context.clear(GPU.context.COLOR_BUFFER_BIT | GPU.context.DEPTH_BUFFER_BIT)
        if (TransformationWorkerAPI.hasChangeBuffer[0] === 1) {
            LightsAPI.packageLights(false, true)
        }
    }
}
