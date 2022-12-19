import STATIC_SHADERS from "../../engine-core/static/resources/STATIC_SHADERS";
import GPU from "../../engine-core/GPU";
import STATIC_MESHES from "../../engine-core/static/resources/STATIC_MESHES";
import VisibilityRenderer from "../../engine-core/runtime/VisibilityRenderer";
import STATIC_FRAMEBUFFERS from "../../engine-core/static/resources/STATIC_FRAMEBUFFERS";
import StaticFBOsController from "../../engine-core/lib/StaticFBOsController";
import StaticMeshesController from "../../engine-core/lib/StaticMeshesController";

let shader, uniforms, buffer, resolution
export default class GridSystem {
    static shader
    static buffer = new Float32Array([.3, 20., 50, 1])

    static initialize() {
        buffer = GridSystem.buffer
        shader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.GRID)
        uniforms = shader.uniformMap

        resolution = new Float32Array([GPU.internalResolution.w, GPU.internalResolution.h])
    }

    static execute() {
        shader.bind()

        GPU.context.uniform4fv(uniforms.settings, buffer)

        GPU.context.activeTexture(GPU.context.TEXTURE0)
        GPU.context.bindTexture(GPU.context.TEXTURE_2D, StaticFBOsController.visibilityDepthSampler)
        GPU.context.uniform1i(uniforms.depthSampler, 0)

        GPU.context.uniform2fv(uniforms.resolution, resolution)

        StaticMeshesController.plane.draw()
    }
}