import GPU from "../../engine-core/GPU";
import SettingsStore from "../../frontend/views/editor/stores/SettingsStore";

import StaticMeshes from "../../engine-core/lib/StaticMeshes";
import StaticFBO from "../../engine-core/lib/StaticFBO";
import StaticEditorShaders from "../lib/StaticEditorShaders";


const fallbackColor = new Float32Array([.5, .5, .5])
export default class SelectedSystem {
    static drawToBuffer(selected){
        const length = selected.length
        if (length > 0) {
            StaticFBO.postProcessing1.startMapping()
            StaticEditorShaders.silhouette.bind()
            for (let m = 0; m < length; m++) {
                const current = selected[m]
                if (!current || !current.active)
                    continue
                const mesh = GPU.meshes.get(current.meshComponent?.meshID)
                if (!mesh)
                    continue

                GPU.context.uniform3fv(StaticEditorShaders.silhouetteUniforms.meshID, current.pickID)
                GPU.context.uniformMatrix4fv(StaticEditorShaders.silhouetteUniforms.transformMatrix, false, current.matrix)
                mesh.draw()
            }
            StaticFBO.postProcessing1.stopMapping()
        }
        else
            StaticFBO.postProcessing1.clear()
    }
    static drawSilhouette(selected, settings) {

        StaticEditorShaders.outline.bind()
        const outlineShaderUniforms = StaticEditorShaders.outlineUniforms
        if (settings.showOutline) {
            GPU.context.activeTexture(GPU.context.TEXTURE0)
            GPU.context.bindTexture(GPU.context.TEXTURE_2D, StaticFBO.visibilityEntitySampler)
            GPU.context.uniform1i(outlineShaderUniforms.silhouette, 0)

            GPU.context.uniform1i(outlineShaderUniforms.isOutline, 1)
            GPU.context.uniform3fv(outlineShaderUniforms.outlineColor, SettingsStore.data.outlineColor || fallbackColor)

            StaticMeshes.drawQuad()
        }
        if (length > 0) {
            GPU.context.activeTexture(GPU.context.TEXTURE0)
            GPU.context.bindTexture(GPU.context.TEXTURE_2D, StaticFBO.postProcessing1Sampler)
            GPU.context.uniform1i(outlineShaderUniforms.silhouette, 0)
            GPU.context.uniform1i(outlineShaderUniforms.isOutline, 0)
            StaticMeshes.drawQuad()
        }

    }
}