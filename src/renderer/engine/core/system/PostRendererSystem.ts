import AbstractSystem from "../AbstractSystem";
import GPUAPI from "../lib/rendering/GPUAPI";
import StaticFBO from "../lib/StaticFBO";
import GPU from "../GPU";

export default class PostRendererSystem extends AbstractSystem{
    execute() {
        GPUAPI.copyTexture(StaticFBO.postProcessing1, StaticFBO.postProcessing2, GPU.context.COLOR_BUFFER_BIT)
    }
}
