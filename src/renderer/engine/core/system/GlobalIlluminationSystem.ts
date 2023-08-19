import GPU from "../GPU"
import StaticMeshesState from "../states/StaticMeshesState"
import StaticFBOState from "../states/StaticFBOState"
import StaticShadersState from "../states/StaticShadersState"
import Framebuffer from "@engine-core/lib/resources/Framebuffer"
import MetricsManager from "../managers/MetricsManager"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import EngineState from "../states/EngineState"
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
            StaticFBOState.ssgi.clear()
            this.#cleared = true
        }
        return EngineState.ssgiEnabled;
    }

    execute() {
        this.#cleared = false
        const context = GPU.context
        const uniforms = StaticShadersState.ssgiUniforms
        StaticFBOState.ssgi.startMapping()
        StaticShadersState.ssgi.bind()

        GPUUtil.bind2DTextureForDrawing(uniforms.sceneDepth, 0, StaticFBOState.sceneDepthVelocity)
        GPUUtil.bind2DTextureForDrawing(uniforms.previousFrame, 1, StaticFBOState.postProcessing2Sampler)
        context.uniform3fv(uniforms.rayMarchSettings, this.#uniformSettings)
        StaticMeshesState.drawQuad()
        this.#applyBlur(context, StaticFBOState.ssgiFallback, StaticFBOState.ssgiSampler, true)
        this.#applyBlur(context, StaticFBOState.ssgi, StaticFBOState.ssgiFallbackSampler, false)

        MetricsManager.currentState = METRICS_FLAGS.SSGI
    }

    #applyBlur(context: WebGL2RenderingContext, FBO: Framebuffer, color: WebGLTexture, first: boolean) {
        const uniforms = StaticShadersState.bilateralBlurUniforms

        if (first) {
            StaticShadersState.bilateralBlur.bind()

            context.uniform1f(uniforms.blurRadius, EngineState.ssgiBlurRadius)
            context.uniform1i(uniforms.samples, EngineState.ssgiBlurSamples)
            context.uniform2fv(uniforms.bufferResolution, StaticFBOState.ssgiFallback.resolution)

            GPUUtil.bind2DTextureForDrawing(uniforms.entityIDSampler, 0, StaticFBOState.entityIDSampler)
        } else
            context.uniform1i(uniforms.samples, EngineState.ssgiBlurSamples / 2)
        FBO.startMapping()
        GPUUtil.bind2DTextureForDrawing(uniforms.sceneColor, 1, color)

        StaticMeshesState.drawQuad()
        FBO.stopMapping()
    }
}
