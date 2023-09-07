import GPUState from "../states/GPUState"
import UberMaterialAttributeGroup from "../lib/UberMaterialAttributeGroup";
import UberShader from "../lib/UberShader";
import StaticMeshesState from "../states/StaticMeshesState";
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";
import SceneRenderingUtil from "./SceneRenderingUtil";
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import CullingComponent from "@engine-core/lib/components/CullingComponent";
import DecalComponent from "@engine-core/lib/components/DecalComponent";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";

export default class DecalRendererSystem extends AbstractSystem{

     shouldExecute = (): boolean =>  {
        return EntityManager.withComponent(Components.DECAL).size > 0;
    }

     execute = () => {
        SceneRenderingUtil.bindGlobalResources()
        const toRender = EntityManager.withComponent(Components.DECAL).array
        const size = toRender.length
        const context = GPUState.context
        const uniforms = UberShader.uberUniforms

        context.disable(context.DEPTH_TEST)
        context.disable(context.CULL_FACE)
        UberMaterialAttributeGroup.clear()
        context.uniform1i(uniforms.isDecalPass, 1)
        StaticMeshesState.cube.bindAllResources()
        for (let i = 0; i < size; i++) {
            const entity = toRender[i]
            const components = EntityManager.getAllComponentsMap(entity)
            const cullingComponent = components.get(Components.CULLING) as CullingComponent
            const transformationComponent = components.get(Components.TRANSFORMATION) as TransformationComponent
            if (!transformationComponent || !EntityManager.isEntityEnabled(entity) || cullingComponent?.isDistanceCulled)
                continue
            const decalComponent = components.get(Components.DECAL) as DecalComponent

            UberMaterialAttributeGroup.screenDoorEffect = cullingComponent?.isScreenDoorEnabled ? 1 : 0
            UberMaterialAttributeGroup.entityID = EntityManager.getEntityPickVec3(entity)

            this.#bindDecalUniforms(uniforms, decalComponent)

            context.uniformMatrix4fv(uniforms.materialAttributes, false, UberMaterialAttributeGroup.data)
            context.uniformMatrix4fv(uniforms.modelMatrix, false, transformationComponent.matrix)

            StaticMeshesState.cube.draw()
        }
        context.enable(context.DEPTH_TEST)
    }

    #bindDecalUniforms(uniforms: UniformMap, component: DecalComponent) {
        const albedoSampler = GPUState.textures.get(component.albedoID)?.texture
        const metallicSampler =  GPUState.textures.get(component.metallicID)?.texture
        const roughnessSampler =  GPUState.textures.get(component.roughnessID)?.texture
        const normalSampler =  GPUState.textures.get(component.normalID)?.texture
        const aoSampler = GPUState.textures.get(component.occlusionID)?.texture
        let texOffset = 7
        if (albedoSampler !== undefined)
            GPUUtil.bind2DTextureForDrawing(uniforms.sampler1, texOffset, albedoSampler)
        if (metallicSampler !== undefined)
            GPUUtil.bind2DTextureForDrawing(uniforms.sampler2, texOffset + 1, metallicSampler)
        if (roughnessSampler !== undefined)
            GPUUtil.bind2DTextureForDrawing(uniforms.sampler3, texOffset + 2, roughnessSampler)
        if (normalSampler !== undefined)
            GPUUtil.bind2DTextureForDrawing(uniforms.sampler4, texOffset + 3, normalSampler)
        if (aoSampler !== undefined)
            GPUUtil.bind2DTextureForDrawing(uniforms.sampler5, texOffset + 4, aoSampler)
        UberMaterialAttributeGroup.useAlbedoDecal = albedoSampler !== undefined ? 1 : 0
        UberMaterialAttributeGroup.useMetallicDecal = metallicSampler !== undefined ? 1 : 0
        UberMaterialAttributeGroup.useRoughnessDecal = roughnessSampler !== undefined ? 1 : 0
        UberMaterialAttributeGroup.useNormalDecal = normalSampler !== undefined ? 1 : 0
        UberMaterialAttributeGroup.useOcclusionDecal = aoSampler !== undefined ? 1 : 0
        UberMaterialAttributeGroup.ssrEnabled = component.useSSR ? 1 : 0
        UberMaterialAttributeGroup.renderingMode = component.renderingMode
        UberMaterialAttributeGroup.anisotropicRotation = component.anisotropicRotation
        UberMaterialAttributeGroup.anisotropy = component.anisotropy
        UberMaterialAttributeGroup.clearCoat = component.clearCoat
        UberMaterialAttributeGroup.sheen = component.sheen
        UberMaterialAttributeGroup.sheenTint = component.sheenTint
    }
}
