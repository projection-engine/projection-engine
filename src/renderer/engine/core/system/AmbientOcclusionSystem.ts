import GPU from "../GPU"
import StaticMeshes from "../lib/StaticMeshes"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import StaticUBOs from "../lib/StaticUBOs"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import EngineState from "../EngineState"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";


export default class AmbientOcclusionSystem extends AbstractSystem {
    noiseScale = new Float32Array(2)
    #ready = false


    constructor() {
        super();
        const RESOLUTION = 4
        this.noiseScale[0] = GPU.internalResolution.w / RESOLUTION
        this.noiseScale[1] = GPU.internalResolution.h / RESOLUTION

        StaticUBOs.ssaoUBO.bind()
        StaticUBOs.ssaoUBO.updateData("settings", new Float32Array([.5, .7, -.1, 1000]))
        StaticUBOs.ssaoUBO.updateData("noiseScale", this.noiseScale)
        StaticUBOs.ssaoUBO.unbind()

        StaticFBO.generateSSAONoise().then(() => this.#ready = true)
    }

    shouldExecute(): boolean {
        return EngineState.ssaoEnabled && this.#ready && EngineState.shouldAOExecute;
    }

    execute() {
        this.#draw()
        this.#blur()

        MetricsController.currentState = METRICS_FLAGS.SSAO
        EngineState.shouldAOExecute = false
    }

    #draw() {
        StaticFBO.ssao.startMapping()
        StaticShaders.ssao.bind()


        GPUUtil.bind2DTextureForDrawing(StaticShaders.ssaoUniforms.sceneDepth, 0, StaticFBO.sceneDepthVelocity)

        GPUUtil.bind2DTextureForDrawing(StaticShaders.ssaoUniforms.noiseSampler, 1, StaticFBO.noiseSampler)

        GPU.context.uniform1i(StaticShaders.ssaoUniforms.maxSamples, EngineState.ssaoMaxSamples)

        StaticMeshes.drawQuad()
        StaticFBO.ssao.stopMapping()
    }

    #blur() {
        StaticShaders.boxBlur.bind()
        StaticFBO.ssaoBlurred.startMapping()

        GPUUtil.bind2DTextureForDrawing(StaticShaders.boxBlurUniforms.sampler, 0, StaticFBO.ssaoSampler)

        GPU.context.uniform1i(StaticShaders.boxBlurUniforms.samples, EngineState.ssaoBlurSamples)

        StaticMeshes.drawQuad()
        StaticFBO.ssaoBlurred.stopMapping()
    }

}

