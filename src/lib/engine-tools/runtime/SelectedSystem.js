import COMPONENTS from "../../../../public/engine/static/COMPONENTS.js"
import GPU from "../../../../public/engine/GPU";
import STATIC_FRAMEBUFFERS from "../../../../public/engine/static/resources/STATIC_FRAMEBUFFERS";
import GPUAPI from "../../../../public/engine/lib/rendering/GPUAPI";


let shader, uniforms, fbo
export default class SelectedSystem {
    static shaderSilhouette
    static shader

    static silhouetteSampler

    static initialize() {
        fbo = GPU.frameBuffers.get(STATIC_FRAMEBUFFERS.POST_PROCESSING_WORKER)
        SelectedSystem.silhouetteSampler = fbo.colors[0]
        shader = SelectedSystem.shader
        uniforms = shader.uniformMap
    }

    static drawToBuffer(selected) {
        const length = selected.length
        if (length === 0)
            return

        fbo.startMapping()
        gpu.disable(gpu.CULL_FACE)
        shader.bind()
        for (let m = 0; m < length; m++) {
            const current = selected[m]
            if (!current || !current.active)
                continue
            const mesh = GPU.meshes.get(current.components.get(COMPONENTS.MESH)?.meshID)
            if (!mesh)
                continue

            gpu.uniform3fv(uniforms.meshID, current.pickID)
            gpu.uniformMatrix4fv(uniforms.transformMatrix, false, current.matrix)
            mesh.draw()
        }
        gpu.enable(gpu.CULL_FACE)
        fbo.stopMapping()

    }

    static drawSilhouette(selected) {
        const length = selected.length
        if (length > 0) {
            SelectedSystem.shaderSilhouette.bindForUse({
                silhouette: SelectedSystem.silhouetteSampler
            })
            drawQuad()
        }
    }
}