import GPU from "../GPU"
import UberMaterialAttributeGroup from "../resource-libs/UberMaterialAttributeGroup";
import UberShader from "../resource-libs/UberShader";
import ResourceEntityMapper from "../resource-libs/ResourceEntityMapper";
import StaticMeshes from "../lib/StaticMeshes";
import GPUUtil from "../utils/GPUUtil";
import EditorEntity from "../../tools/EditorEntity";
import AbstractSystem from "../AbstractSystem";
import SceneRenderingUtil from "./SceneRenderingUtil";

export default class DecalRendererSystem extends AbstractSystem{

    shouldExecute(): boolean {
        return ResourceEntityMapper.decals.size > 0;
    }

    execute() {
        SceneRenderingUtil.bindGlobalResources()
        const toRender = ResourceEntityMapper.decals.array
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
            if (!entity.active || entity.isCulled)
                continue

            const culling = entity.cullingComponent
            UberMaterialAttributeGroup.screenDoorEffect = culling && culling.screenDoorEffect ? entity.__cullingMetadata[5] : 0
            UberMaterialAttributeGroup.entityID = entity.pickID

            this.#bindDecalUniforms(uniforms, entity)

            context.uniformMatrix4fv(uniforms.materialAttributes, false, UberMaterialAttributeGroup.data)
            context.uniformMatrix4fv(uniforms.modelMatrix, false, entity.matrix)

            StaticMeshes.cube.draw()
        }
        context.enable(context.DEPTH_TEST)
    }

    #bindDecalUniforms(uniforms: UniformMap, entity: EditorEntity) {
        const component = entity.decalComponent
        const albedoSampler = component.albedo?.texture
        const metallicSampler = component.metallic?.texture
        const roughnessSampler = component.roughness?.texture
        const normalSampler = component.normal?.texture
        const aoSampler = component.occlusion?.texture
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
