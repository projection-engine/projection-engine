import GPU from "../GPU"
import StaticMeshesState from "../states/StaticMeshesState"
import StaticFBOState from "../states/StaticFBOState"
import StaticShadersState from "../states/StaticShadersState"
import StaticUBOState from "../states/StaticUBOState"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import EngineState from "../states/EngineState"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";


export default class AmbientOcclusionSystem extends AbstractSystem {
    #noiseScale = new Float32Array(2)
    #ready = false

    constructor() {
        super();
        this.#noiseScale[0] = GPU.internalResolution.w / 4
        this.#noiseScale[1] = GPU.internalResolution.h / 4

        StaticUBOState.ssaoUBO.bind()
        StaticUBOState.ssaoUBO.updateData("settings", new Float32Array([.5, .7, -.1, 1000]))
        StaticUBOState.ssaoUBO.updateData("noiseScale", this.#noiseScale)
        StaticUBOState.ssaoUBO.unbind()

        StaticFBOState.generateSSAONoise().then(() => this.#ready = true)
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
        StaticFBOState.ssao.startMapping()
        StaticShadersState.ssao.bind()


        GPUUtil.bind2DTextureForDrawing(StaticShadersState.ssaoUniforms.sceneDepth, 0, StaticFBOState.sceneDepthVelocity)

        GPUUtil.bind2DTextureForDrawing(StaticShadersState.ssaoUniforms.noiseSampler, 1, StaticFBOState.noiseSampler)

        GPU.context.uniform1i(StaticShadersState.ssaoUniforms.maxSamples, EngineState.ssaoMaxSamples)

        StaticMeshesState.drawQuad()
        StaticFBOState.ssao.stopMapping()
    }

    #blur() {
        StaticShadersState.boxBlur.bind()
        StaticFBOState.ssaoBlurred.startMapping()

        GPUUtil.bind2DTextureForDrawing(StaticShadersState.boxBlurUniforms.sampler, 0, StaticFBOState.ssaoSampler)

        GPU.context.uniform1i(StaticShadersState.boxBlurUniforms.samples, EngineState.ssaoBlurSamples)

        StaticMeshesState.drawQuad()
        StaticFBOState.ssaoBlurred.stopMapping()
    }

}

