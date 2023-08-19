import AbstractSystem from "../AbstractSystem";
import GPUAPI from "../lib/rendering/GPUAPI";
import StaticFBOState from "../states/StaticFBOState";
import GPU from "../GPU";

export default class PostRendererSystem extends AbstractSystem{
    execute() {
        GPUAPI.copyTexture(StaticFBOState.postProcessing1, StaticFBOState.postProcessing2, GPU.context.COLOR_BUFFER_BIT)
    }
}
