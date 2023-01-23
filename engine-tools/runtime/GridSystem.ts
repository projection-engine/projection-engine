import GPU from "../../engine-core/GPU";
import StaticFBO from "../../engine-core/lib/StaticFBO";
import StaticMeshes from "../../engine-core/lib/StaticMeshes";
import StaticEditorShaders from "../lib/StaticEditorShaders";

let   buffer, resolution
export default class GridSystem {
    static buffer = new Float32Array([.3, 20., 50, 1])

    static initialize() {
        buffer = GridSystem.buffer
        resolution = new Float32Array([GPU.internalResolution.w, GPU.internalResolution.h])
    }

    static execute() {
        StaticEditorShaders.grid.bind()
        const uniforms = StaticEditorShaders.gridUniforms

        GPU.context.uniform4fv(uniforms.settings, buffer)

        GPU.context.activeTexture(GPU.context.TEXTURE0)
        GPU.context.bindTexture(GPU.context.TEXTURE_2D, StaticFBO.sceneDepth)
        GPU.context.uniform1i(uniforms.depthSampler, 0)

        GPU.context.uniform2fv(uniforms.resolution, resolution)

        StaticMeshes.plane.draw()
    }
}