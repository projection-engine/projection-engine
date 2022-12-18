import COMPONENTS from "../../engine-core/static/COMPONENTS.js"
import GPU from "../../engine-core/GPU";
import STATIC_FRAMEBUFFERS from "../../engine-core/static/resources/STATIC_FRAMEBUFFERS";
import VisibilityRenderer from "../../engine-core/runtime/rendering/VisibilityRenderer";
import SettingsStore from "../../frontend/editor/stores/SettingsStore";
import STATIC_SHADERS from "../../engine-core/static/resources/STATIC_SHADERS";


let shader, uniforms, fbo, outlineShader, outlineShaderUniforms
const fallbackColor = new Float32Array([.5, .5, .5])
export default class SelectedSystem {
    static shader

    static initialize() {
        fbo = GPU.frameBuffers.get(STATIC_FRAMEBUFFERS.CHACHE_BUFFER)

        shader = SelectedSystem.shader
        uniforms = shader.uniformMap

        outlineShader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.SILHOUETTE_OUTLINE)
        outlineShaderUniforms = outlineShader.uniformMap

    }


    static drawSilhouette(selected, settings) {



        const length = selected.length
        if (length > 0) {
            fbo.startMapping()
            shader.bind()
            for (let m = 0; m < length; m++) {
                const current = selected[m]
                if (!current || !current.active)
                    continue
                const mesh = GPU.meshes.get(current.components.get(COMPONENTS.MESH)?.meshID)
                if (!mesh)
                    continue

                GPU.context.uniform3fv(uniforms.meshID, current.pickID)
                GPU.context.uniformMatrix4fv(uniforms.transformMatrix, false, current.matrix)
                mesh.draw()
            }
            fbo.stopMapping()
        }
        outlineShader.bind()
        if (settings.showOutline) {
            GPU.context.activeTexture(GPU.context.TEXTURE0)
            GPU.context.bindTexture(GPU.context.TEXTURE_2D, VisibilityRenderer.entityIDSampler)
            GPU.context.uniform1i(outlineShaderUniforms.silhouette, 0)

            GPU.context.uniform1i(outlineShaderUniforms.isOutline, 1)
            GPU.context.uniform3fv(outlineShaderUniforms.outlineColor, SettingsStore.data.outlineColor || fallbackColor)

            GPU.drawQuad()
        }
        if (length > 0) {
            GPU.context.activeTexture(GPU.context.TEXTURE0)
            GPU.context.bindTexture(GPU.context.TEXTURE_2D, fbo.colors[0])
            GPU.context.uniform1i(outlineShaderUniforms.silhouette, 0)
            GPU.context.uniform1i(outlineShaderUniforms.isOutline, 0)
            GPU.drawQuad()
        }

    }
}