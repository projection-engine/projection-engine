import AbstractSystem from "../../core/AbstractSystem";
import GPU from "../../core/GPU";
import StaticEditorShaders from "../utils/StaticEditorShaders";
import EngineToolsState from "../EngineToolsState";
import GPUUtil from "../../core/utils/GPUUtil";
import StaticFBO from "../../core/lib/StaticFBO";
import StaticMeshes from "../../core/lib/StaticMeshes";
import EngineTools from "../EngineTools";

export default class SilhouetteSystem extends AbstractSystem {
    static #FALLBACK_COLOR = new Float32Array([.5, .5, .5])

    execute() {
        const context = GPU.context

        StaticEditorShaders.outline.bind()
        const outlineShaderUniforms = StaticEditorShaders.outlineUniforms
        context.uniform2fv(outlineShaderUniforms.bufferSize, GPU.bufferResolution)
        context.uniform1f(outlineShaderUniforms.outlineWidth, EngineToolsState.outlineWidth)
        if (EngineToolsState.showOutline) {
            GPUUtil.bind2DTextureForDrawing(outlineShaderUniforms.silhouette, 0, StaticFBO.entityIDSampler)

            context.uniform1i(outlineShaderUniforms.isOutline, 1)
            context.uniform3fv(outlineShaderUniforms.outlineColor, EngineToolsState.outlineColor || SilhouetteSystem.#FALLBACK_COLOR)
            context.uniform2fv(outlineShaderUniforms.mouseCoordinates, EngineToolsState.mouseCoordinates)
            StaticMeshes.drawQuad()
        }

        const length = EngineTools.selected.length
        if (length > 0) {
            context.activeTexture(context.TEXTURE0)
            context.bindTexture(context.TEXTURE_2D, StaticFBO.postProcessing1Sampler)
            context.uniform1i(outlineShaderUniforms.silhouette, 0)
            context.uniform1i(outlineShaderUniforms.isOutline, 0)
            StaticMeshes.drawQuad()
        }
    }
}
