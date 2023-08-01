import GPU from "../GPU"
import StaticMeshes from "../lib/StaticMeshes"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";
import EngineState from "../EngineState";


export default class MotionBlurSystem extends AbstractSystem {
    shouldExecute(): boolean {
        return EngineState.motionBlurEnabled;
    }

    execute() {
        StaticFBO.postProcessing1.startMapping()
        StaticShaders.mb.bind()
        const uniforms = StaticShaders.mbUniforms
        const context = GPU.context

        GPUUtil.bind2DTextureForDrawing(uniforms.currentFrame, 0, StaticFBO.postProcessing2Sampler)
        GPUUtil.bind2DTextureForDrawing(uniforms.gVelocity, 1, StaticFBO.sceneDepthVelocity)
        context.uniform2fv(uniforms.bufferResolution, GPU.bufferResolution)
        context.uniform1f(uniforms.velocityScale, EngineState.motionBlurVelocityScale)
        context.uniform1i(uniforms.maxSamples, EngineState.motionBlurMaxSamples)

        StaticMeshes.drawQuad()
        StaticFBO.postProcessing1.stopMapping()
        MetricsController.currentState = METRICS_FLAGS.MOTION_BLUR
    }
}
