import STATIC_SHADERS from "../../engine-core/static/resources/STATIC_SHADERS";
import GPU from "../../engine-core/lib/GPU";
import STATIC_MESHES from "../../engine-core/static/resources/STATIC_MESHES";
import VisibilityRenderer from "../../engine-core/runtime/rendering/VisibilityRenderer";
import STATIC_FRAMEBUFFERS from "../../engine-core/static/resources/STATIC_FRAMEBUFFERS";

let shader, uniforms, planeMesh, buffer, resolution
export default class GridSystem {
    static shader
    static buffer = new Float32Array([.3, 20., 50, 1])

    static initialize() {
        buffer = GridSystem.buffer
        shader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.GRID)
        uniforms = shader.uniformMap

        planeMesh = GPU.meshes.get(STATIC_MESHES.PRODUCTION.PLANE)

        const FBO = GPU.frameBuffers.get(STATIC_FRAMEBUFFERS.VISIBILITY_BUFFER)
        resolution = new Float32Array([FBO.width, FBO.height])
    }

    static execute() {
        shader.bind()

        gpu.uniform4fv(uniforms.settings, buffer)

        gpu.activeTexture(gpu.TEXTURE0)
        gpu.bindTexture(gpu.TEXTURE_2D, VisibilityRenderer.depthSampler)
        gpu.uniform1i(uniforms.depthSampler, 0)

        gpu.uniform2fv(uniforms.resolution, resolution)

        planeMesh.draw()
    }
}