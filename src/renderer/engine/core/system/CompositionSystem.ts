import GPU from "../GPU"
import StaticMeshes from "../lib/StaticMeshes"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import StaticUBOs from "../lib/StaticUBOs"
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
        StaticUBOs.frameCompositionUBO.bind()
        StaticUBOs.frameCompositionUBO.updateData("FXAASpanMax", new Float32Array([8.0]))
        StaticUBOs.frameCompositionUBO.updateData("FXAAReduceMin", new Float32Array([1.0 / 128.0]))
        StaticUBOs.frameCompositionUBO.updateData("FXAAReduceMul", new Float32Array([1.0 / 8.0]))
        StaticUBOs.frameCompositionUBO.updateData("inverseFilterTextureSize", new Float32Array([1 / GPU.internalResolution.w, 1 / GPU.internalResolution.h]))
        StaticUBOs.frameCompositionUBO.unbind()

        for (let i = 0; i < this.#lookUpRandom.length; i++) {
            this.#lookUpRandom[i] = Math.random()
        }
    }

    #lookup() {
        return ++this.#lookUpIndex >= this.#lookUpRandom.length ? this.#lookUpRandom[this.#lookUpIndex = 0] : this.#lookUpRandom[this.#lookUpIndex]
    }

    execute() {
        const context = GPU.context
        const shader = StaticShaders.composition, uniforms = StaticShaders.compositionUniforms

        this.#currentNoise = this.#lookup()

        shader.bind()
        GPUUtil.bind2DTextureForDrawing(uniforms.currentFrame, 0, StaticFBO.lensSampler)

        context.uniform1f(uniforms.filmGrainSeed, this.#currentNoise)
        StaticMeshes.drawQuad()
        MetricsController.currentState = METRICS_FLAGS.FRAME_COMPOSITION
    }
}
