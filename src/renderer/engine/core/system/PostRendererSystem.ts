import AbstractSystem from "../AbstractSystem";
import GPUManager from "../managers/GPUManager";
import StaticFBOState from "../states/StaticFBOState";
import GPU from "../GPU";

export default class PostRendererSystem extends AbstractSystem{
    execute() {
        GPUManager.copyTexture(StaticFBOState.postProcessing1, StaticFBOState.postProcessing2, GPU.context.COLOR_BUFFER_BIT)
    }
}
