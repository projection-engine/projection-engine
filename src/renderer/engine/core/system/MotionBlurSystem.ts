import GPU from "../GPU"
import StaticMeshesState from "../states/StaticMeshesState"
import StaticFBOState from "../states/StaticFBOState"
import StaticShadersState from "../states/StaticShadersState"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";
import EngineState from "../states/EngineState";


export default class MotionBlurSystem extends AbstractSystem {
    shouldExecute(): boolean {
        return EngineState.motionBlurEnabled;
    }

    execute() {
        StaticFBOState.postProcessing1.startMapping()
        StaticShadersState.mb.bind()
        const uniforms = StaticShadersState.mbUniforms
        const context = GPU.context

        GPUUtil.bind2DTextureForDrawing(uniforms.currentFrame, 0, StaticFBOState.postProcessing2Sampler)
        GPUUtil.bind2DTextureForDrawing(uniforms.gVelocity, 1, StaticFBOState.sceneDepthVelocity)
        context.uniform2fv(uniforms.bufferResolution, GPU.bufferResolution)
        context.uniform1f(uniforms.velocityScale, EngineState.motionBlurVelocityScale)
        context.uniform1i(uniforms.maxSamples, EngineState.motionBlurMaxSamples)

        StaticMeshesState.drawQuad()
        StaticFBOState.postProcessing1.stopMapping()
        MetricsController.currentState = METRICS_FLAGS.MOTION_BLUR
    }
}
