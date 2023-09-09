import GPUState from "../states/GPUState";
import AbstractSystem from "../AbstractSystem";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import EntityManager from "@engine-core/managers/EntityManager";
import {Components} from "@engine-core/engine.enum";
import TerrainComponent from "@engine-core/lib/components/TerrainComponent";
import AssetResourceManager from "@engine-core/managers/AssetResourceManager";
import Terrain from "@engine-core/lib/resources/Terrain";
import StaticShadersState from "@engine-core/states/StaticShadersState";
import GPUUtil from "@engine-core/utils/GPUUtil";
import CameraState from "@engine-core/states/CameraState";

export default class TerrainRendererSystem extends AbstractSystem {
    execute = () => {
        GPUState.context.enable(GPUState.context.CULL_FACE)
        const toRender = EntityManager.withComponent(Components.TERRAIN).array
        const size = toRender.length
        if (size === 0)
            return
        StaticShadersState.terrain.bind()
        for (let meshIndex = 0; meshIndex < size; meshIndex++) {
            const entity = toRender[meshIndex]
            const components = EntityManager.getAllComponentsMap(entity)
            const terrainComponent = components.get(Components.TERRAIN) as TerrainComponent
            const transformComponent = components.get(Components.TRANSFORMATION) as TransformationComponent
            const terrain = AssetResourceManager.getTerrain(terrainComponent.terrainID)
            if (terrain == null || !transformComponent || !terrainComponent.terrainID || !EntityManager.isEntityEnabled(entity))
                continue
            this.#loop(terrainComponent, terrain, transformComponent)
        }
    }

    #loop = (terrainComponent: TerrainComponent, terrain: Terrain, transformComponent: TransformationComponent) => {
        const uniforms = StaticShadersState.terrainUniforms
        const context = GPUState.context
        const heightMapTexture = terrain.getHeightMapTexture()
        if (heightMapTexture == null) {
            return
        }
        GPUUtil.bind2DTextureForDrawing(uniforms.heightMap, 0, heightMapTexture.texture)
        context.uniformMatrix4fv(uniforms.modelMatrix, false, transformComponent.matrix)
        context.uniform1f(uniforms.heightScale, terrainComponent.heightScale)
        context.uniformMatrix4fv(uniforms.viewProjection, false, CameraState.viewProjectionMatrix)
        terrain.draw()
    }
}
