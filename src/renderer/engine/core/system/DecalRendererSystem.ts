import GPU from "../GPU"
import UberMaterialAttributeGroup from "../resource-libs/UberMaterialAttributeGroup";
import UberShader from "../resource-libs/UberShader";
import ResourceEntityMapper from "../resource-libs/ResourceEntityMapper";
import StaticMeshes from "../lib/StaticMeshes";
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";
import SceneRenderingUtil from "./SceneRenderingUtil";
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/EntityManager";
import CullingComponent from "@engine-core/components/CullingComponent";
import DecalComponent from "@engine-core/components/DecalComponent";
import TransformationComponent from "@engine-core/components/TransformationComponent";

export default class DecalRendererSystem extends AbstractSystem{

    shouldExecute(): boolean {
        return ResourceEntityMapper.withComponent(Components.DECAL).size > 0;
    }

    execute() {
        SceneRenderingUtil.bindGlobalResources()
        const toRender = ResourceEntityMapper.withComponent(Components.DECAL).array
        const size = toRender.length
        const context = GPU.context
        const uniforms = UberShader.uberUniforms

        context.disable(context.DEPTH_TEST)
        context.disable(context.CULL_FACE)
        UberMaterialAttributeGroup.clear()
        context.uniform1i(uniforms.isDecalPass, 1)
        StaticMeshes.cube.bindAllResources()
        for (let i = 0; i < size; i++) {
            const entity = toRender[i]
            const components = EntityManager.getAllComponentsMap(entity)
            const cullingComponent = components.get(Components.CULLING) as CullingComponent
            const transformationComponent = components.get(Components.TRANSFORMATION) as TransformationComponent
            if (!transformationComponent || !EntityManager.isEntityEnabled(entity) || cullingComponent?.isDistanceCulled)
                continue
            const decalComponent = components.get(Components.DECAL) as DecalComponent

            UberMaterialAttributeGroup.screenDoorEffect = cullingComponent?.isScreenDoorEnabled ? 1 : 0
            // UberMaterialAttributeGroup.entityID = entity.pickID

            this.#bindDecalUniforms(uniforms, decalComponent)

            context.uniformMatrix4fv(uniforms.materialAttributes, false, UberMaterialAttributeGroup.data)
            context.uniformMatrix4fv(uniforms.modelMatrix, false, transformationComponent.matrix)

            StaticMeshes.cube.draw()
        }
        context.enable(context.DEPTH_TEST)
    }

    #bindDecalUniforms(uniforms: UniformMap, component: DecalComponent) {
        const albedoSampler = GPU.textures.get(component.albedoID)?.texture
        const metallicSampler =  GPU.textures.get(component.metallicID)?.texture
        const roughnessSampler =  GPU.textures.get(component.roughnessID)?.texture
        const normalSampler =  GPU.textures.get(component.normalID)?.texture
        const aoSampler = GPU.textures.get(component.occlusionID)?.texture
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
