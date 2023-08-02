import GPU from "../../core/GPU"
import StaticFBO from "../../core/lib/StaticFBO"
import StaticMeshes from "../../core/lib/StaticMeshes"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import EngineToolsState from "../EngineToolsState"
import GPUUtil from "../../core/utils/GPUUtil";
import AbstractSystem from "../../core/AbstractSystem";

export default class GridSystem extends AbstractSystem {
    #buffer = new Float32Array([.3, 20, 50, 1])

    shouldExecute(): boolean {
        return EngineToolsState.showGrid
    }

    execute() {
        const context = GPU.context
        const uniforms = StaticEditorShaders.gridUniforms
        const buffer = this.#buffer

        StaticEditorShaders.grid.bind()
        buffer[0] = EngineToolsState.gridColor
        buffer[1] = EngineToolsState.gridScale
        buffer[2] = EngineToolsState.gridThreshold
        buffer[3] = EngineToolsState.gridOpacity

        context.uniform4fv(uniforms.settings, buffer)

        GPUUtil.bind2DTextureForDrawing(uniforms.sceneDepth, 0, StaticFBO.sceneDepthVelocity)


        context.uniform2fv(uniforms.resolution, GPU.bufferResolution)

        StaticMeshes.plane.draw()
    }
}
