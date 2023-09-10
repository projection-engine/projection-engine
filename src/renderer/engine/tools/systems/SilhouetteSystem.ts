import AbstractSystem from "../../core/AbstractSystem";
import GPUState from "@engine-core/states/GPUState";
import StaticEditorShaders from "../state/StaticEditorShaders";
import EngineToolsState from "../state/EngineToolsState";
import GPUUtil from "../../core/utils/GPUUtil";
import StaticFBOState from "@engine-core/states/StaticFBOState";
import StaticMeshesState from "@engine-core/states/StaticMeshesState";

export default class SilhouetteSystem extends AbstractSystem {
    static #FALLBACK_COLOR = new Float32Array([.5, .5, .5])

     execute = () => {
        const context = GPUState.context

        StaticEditorShaders.outline.bind()
        const outlineShaderUniforms = StaticEditorShaders.outlineUniforms
        context.uniform2fv(outlineShaderUniforms.bufferSize, GPUState.bufferResolution)
        context.uniform1f(outlineShaderUniforms.outlineWidth, EngineToolsState.outlineWidth)
        if (EngineToolsState.showOutline) {
            GPUUtil.bind2DTextureForDrawing(outlineShaderUniforms.silhouette, 0, StaticFBOState.entityIDSampler)

            context.uniform1i(outlineShaderUniforms.isOutline, 1)
            context.uniform3fv(outlineShaderUniforms.outlineColor, EngineToolsState.outlineColor || SilhouetteSystem.#FALLBACK_COLOR)
            context.uniform2fv(outlineShaderUniforms.mouseCoordinates, EngineToolsState.mouseCoordinates)
            StaticMeshesState.drawQuad()
        }

        const length = EngineToolsState.selected.length
        if (length > 0) {
            context.activeTexture(context.TEXTURE0)
            context.bindTexture(context.TEXTURE_2D, StaticFBOState.postProcessing1Sampler)
            context.uniform1i(outlineShaderUniforms.silhouette, 0)
            context.uniform1i(outlineShaderUniforms.isOutline, 0)
            StaticMeshesState.drawQuad()
        }
    }
}
