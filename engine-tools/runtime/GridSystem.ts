import GPU from "../../engine-core/GPU";
import StaticFBO from "../../engine-core/lib/StaticFBO";
import StaticMeshes from "../../engine-core/lib/StaticMeshes";
import StaticEditorShaders from "../lib/StaticEditorShaders";

export default class GridSystem {
    static #buffer = new Float32Array([.3, 20., 50, 1])


    static execute(settings) {
        StaticEditorShaders.grid.bind()
        const uniforms = StaticEditorShaders.gridUniforms
        const buffer = GridSystem.#buffer
        buffer[0] = settings.gridColor
        buffer[1] = settings.gridScale* 10.
        buffer[2] = settings.gridThreshold
        buffer[3] = settings.gridOpacity


        GPU.context.uniform4fv(uniforms.settings, buffer)

        GPU.context.activeTexture(GPU.context.TEXTURE0)
        GPU.context.bindTexture(GPU.context.TEXTURE_2D, StaticFBO.sceneDepthVelocity)
        GPU.context.uniform1i(uniforms.sceneDepth, 0)

        GPU.context.uniform2fv(uniforms.resolution, GPU.bufferResolution)

        StaticMeshes.plane.draw()
    }
}