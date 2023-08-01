import GPU from "../GPU"
import StaticMeshes from "../lib/StaticMeshes"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import Framebuffer from "../instances/Framebuffer"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import EngineState from "../EngineState"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";

export default class GlobalIlluminationSystem extends AbstractSystem {
    #uniformSettings = new Float32Array(3)
    #cleared = false

    static getInstance() {
        return super.get<GlobalIlluminationSystem>()
    }

    updateUniforms() {
        this.#uniformSettings[0] = EngineState.ssgiStepSize
        this.#uniformSettings[1] = EngineState.ssgiMaxSteps
        this.#uniformSettings[2] = EngineState.ssgiStrength
    }

    shouldExecute(): boolean {
        if (!EngineState.ssgiEnabled && !this.#cleared) {
            StaticFBO.ssgi.clear()
            this.#cleared = true
        }
        return EngineState.ssgiEnabled;
    }

    execute() {
        this.#cleared = false
        const context = GPU.context
        const uniforms = StaticShaders.ssgiUniforms
        StaticFBO.ssgi.startMapping()
        StaticShaders.ssgi.bind()

        GPUUtil.bind2DTextureForDrawing(uniforms.sceneDepth, 0, StaticFBO.sceneDepthVelocity)
        GPUUtil.bind2DTextureForDrawing(uniforms.previousFrame, 1, StaticFBO.postProcessing2Sampler)
        context.uniform3fv(uniforms.rayMarchSettings, this.#uniformSettings)
        StaticMeshes.drawQuad()
        this.#applyBlur(context, StaticFBO.ssgiFallback, StaticFBO.ssgiSampler, true)
        this.#applyBlur(context, StaticFBO.ssgi, StaticFBO.ssgiFallbackSampler, false)

        MetricsController.currentState = METRICS_FLAGS.SSGI
    }

    #applyBlur(context: WebGL2RenderingContext, FBO: Framebuffer, color: WebGLTexture, first: boolean) {
        const uniforms = StaticShaders.bilateralBlurUniforms

        if (first) {
            StaticShaders.bilateralBlur.bind()

            context.uniform1f(uniforms.blurRadius, EngineState.ssgiBlurRadius)
            context.uniform1i(uniforms.samples, EngineState.ssgiBlurSamples)
            context.uniform2fv(uniforms.bufferResolution, StaticFBO.ssgiFallback.resolution)

            GPUUtil.bind2DTextureForDrawing(uniforms.entityIDSampler, 0, StaticFBO.entityIDSampler)
        } else
            context.uniform1i(uniforms.samples, EngineState.ssgiBlurSamples / 2)
        FBO.startMapping()
        GPUUtil.bind2DTextureForDrawing(uniforms.sceneColor, 1, color)

        StaticMeshes.drawQuad()
        FBO.stopMapping()
    }
}
