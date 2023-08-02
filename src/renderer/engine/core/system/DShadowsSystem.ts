import GPU from "../GPU"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import ResourceEntityMapper from "../resource-libs/ResourceEntityMapper"
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import AbstractSystem from "../AbstractSystem";
import EngineState from "../EngineState";


export default class DShadowsSystem extends AbstractSystem {
    shouldExecute(): boolean {
        return EngineState.directionalLightsChanged || EngineState.directionalLightsToUpdate.length > 0;
    }

    execute() {
        GPU.context.cullFace(GPU.context.FRONT)
        let currentColumn = 0, currentRow = 0
        StaticFBO.shadows.startMapping()
        GPU.context.enable(GPU.context.SCISSOR_TEST)
        const size = EngineState.directionalLightsAtlasRatio ** 2
        const resPr = EngineState.directionalLightsResolutionPerTexture
        for (let face = 0; face < size; face++) {
            if (face < EngineState.directionalLightsToUpdate.length) {
                const currentLight = EngineState.directionalLightsToUpdate[face]

                GPU.context.viewport(
                    currentColumn * resPr,
                    currentRow * resPr,
                    resPr,
                    resPr
                )
                GPU.context.scissor(
                    currentColumn * resPr,
                    currentRow * resPr,
                    resPr,
                    resPr
                )

                currentLight.atlasFace = [currentColumn, 0]
                this.#loopMeshes(currentLight)
            }
            if (currentColumn > EngineState.directionalLightsAtlasRatio) {
                currentColumn = 0
                currentRow += 1
            } else
                currentColumn += 1
        }
        GPU.context.disable(GPU.context.SCISSOR_TEST)
        StaticFBO.shadows.stopMapping()
        GPU.context.cullFace(GPU.context.BACK)
        EngineState.directionalLightsChanged = false
        EngineState.directionalLightsToUpdate.length = 0
        MetricsController.currentState = METRICS_FLAGS.DIRECTIONAL_SHADOWS
    }

    #loopMeshes(light) {
        if (!light.entity)
            return
        const toRender = ResourceEntityMapper.meshes.array
        const size = toRender.length
        for (let m = 0; m < size; m++) {
            const current = toRender[m], meshComponent = current.meshComponent
            const mesh = current.meshRef
            if (!mesh || !meshComponent.castsShadows || !current.active || current.materialRef?.renderingMode === MATERIAL_RENDERING_TYPES.SKY)
                continue
            StaticShaders.directShadows.bind()
            const U = StaticShaders.directShadowsUniforms

            GPU.context.uniformMatrix4fv(U.viewMatrix, false, light.__lightView)
            GPU.context.uniformMatrix4fv(U.transformMatrix, false, current.matrix)
            GPU.context.uniformMatrix4fv(U.projectionMatrix, false, light.__lightProjection)

            mesh.draw()
        }
    }

}
