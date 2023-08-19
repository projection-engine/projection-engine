import GPU from "../GPU"
import StaticMeshesState from "../states/StaticMeshesState"
import StaticFBOState from "../states/StaticFBOState"
import StaticShadersState from "../states/StaticShadersState"
import StaticUBOState from "../states/StaticUBOState"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";


export default class CompositionSystem extends AbstractSystem {
    #lookUpRandom = new Float32Array(2e+3)
    #lookUpIndex = 0
    #currentNoise = 0

    constructor() {
        super()
        StaticUBOState.frameCompositionUBO.bind()
        StaticUBOState.frameCompositionUBO.updateData("FXAASpanMax", new Float32Array([8.0]))
        StaticUBOState.frameCompositionUBO.updateData("FXAAReduceMin", new Float32Array([1.0 / 128.0]))
        StaticUBOState.frameCompositionUBO.updateData("FXAAReduceMul", new Float32Array([1.0 / 8.0]))
        StaticUBOState.frameCompositionUBO.updateData("inverseFilterTextureSize", new Float32Array([1 / GPU.internalResolution.w, 1 / GPU.internalResolution.h]))
        StaticUBOState.frameCompositionUBO.unbind()

        for (let i = 0; i < this.#lookUpRandom.length; i++) {
            this.#lookUpRandom[i] = Math.random()
        }
    }

    #lookup() {
        return ++this.#lookUpIndex >= this.#lookUpRandom.length ? this.#lookUpRandom[this.#lookUpIndex = 0] : this.#lookUpRandom[this.#lookUpIndex]
    }

    execute() {
        const context = GPU.context
        const shader = StaticShadersState.composition, uniforms = StaticShadersState.compositionUniforms

        this.#currentNoise = this.#lookup()

        shader.bind()
        GPUUtil.bind2DTextureForDrawing(uniforms.currentFrame, 0, StaticFBOState.lensSampler)

        context.uniform1f(uniforms.filmGrainSeed, this.#currentNoise)
        StaticMeshesState.drawQuad()
        MetricsController.currentState = METRICS_FLAGS.FRAME_COMPOSITION
    }
}
