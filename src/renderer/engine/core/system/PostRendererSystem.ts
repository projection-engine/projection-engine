import AbstractSystem from "../AbstractSystem";
import GPUManager from "../managers/GPUManager";
import StaticFBOState from "../states/StaticFBOState";
import GPUState from "../states/GPUState";

export default class PostRendererSystem extends AbstractSystem{
    execute() {
        GPUManager.copyTexture(StaticFBOState.postProcessing1, StaticFBOState.postProcessing2, GPUState.context.COLOR_BUFFER_BIT)
    }
}
