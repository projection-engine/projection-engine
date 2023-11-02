import GPUState from "../states/GPUState"
import StaticFBOState from "../states/StaticFBOState"
import StaticShadersState from "../states/StaticShadersState"
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES"
import AbstractSystem from "../AbstractSystem";
import EngineState from "../states/EngineState";
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import MeshComponent from "@engine-core/lib/components/MeshComponent";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import LightComponent from "@engine-core/lib/components/LightComponent";
import AssetResourceManager from "@engine-core/managers/AssetResourceManager";


export default class DShadowsSystem extends AbstractSystem {
     shouldExecute = (): boolean =>  {
        return EngineState.directionalLightsChanged || EngineState.directionalLightsToUpdate.length > 0;
    }

     execute = () => {
        const context = GPUState.context
        context.cullFace(context.FRONT)
        let currentColumn = 0, currentRow = 0
        StaticFBOState.shadows.startMapping()
        context.enable(context.SCISSOR_TEST)
        const size = EngineState.directionalLightsAtlasRatio ** 2
        const resPr = EngineState.directionalLightsResolutionPerTexture
        for (let face = 0; face < size; face++) {
            if (face < EngineState.directionalLightsToUpdate.length) {
                const currentLight = EngineState.directionalLightsToUpdate[face]

                context.viewport(
                    currentColumn * resPr,
                    currentRow * resPr,
                    resPr,
                    resPr
                )
                context.scissor(
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
        context.disable(context.SCISSOR_TEST)
        StaticFBOState.shadows.stopMapping()
        context.cullFace(context.BACK)
        EngineState.directionalLightsChanged = false
        EngineState.directionalLightsToUpdate.length = 0
    }

    #loopMeshes(light: LightComponent) {
        const context = GPUState.context
        const toRender = EntityManager.withComponent(Components.MESH).array
        const size = toRender.length
        for (let m = 0; m < size; m++) {
            const current = toRender[m]
            const components = EntityManager.getAllComponentsMap(current)
            const meshComponent = components.get(Components.MESH) as MeshComponent
            const mesh = AssetResourceManager.getMesh(meshComponent.meshID)
            const material = AssetResourceManager.getMaterial(meshComponent.materialID)
            if (!mesh || !meshComponent.castsShadows || !EntityManager.isEntityEnabled(current) || material && material.renderingMode === MATERIAL_RENDERING_TYPES.SKY)
                continue
            const transformation = components.get(Components.TRANSFORMATION) as TransformationComponent
            StaticShadersState.directShadows.bind()
            const U = StaticShadersState.directShadowsUniforms

            context.uniformMatrix4fv(U.viewMatrix, false, light.__lightView)
            context.uniformMatrix4fv(U.transformMatrix, false, transformation.matrix)
            context.uniformMatrix4fv(U.projectionMatrix, false, light.__lightProjection)

            mesh.draw()
        }
    }

}
