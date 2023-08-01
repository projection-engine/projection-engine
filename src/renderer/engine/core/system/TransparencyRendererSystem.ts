import SceneRenderingUtil from "./SceneRenderingUtil"
import StaticFBO from "../lib/StaticFBO"
import UberMaterialAttributeGroup from "../resource-libs/UberMaterialAttributeGroup";
import UberShader from "../resource-libs/UberShader";
import GPU from "../GPU";
import Entity from "../instances/Entity";
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES";
import MaterialResourceMapper from "../lib/MaterialResourceMapper";
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";
import GPUAPI from "../lib/rendering/GPUAPI";

export default class TransparencyRendererSystem extends AbstractSystem {
    execute() {
        StaticFBO.postProcessing2.stopMapping()
        if(MaterialResourceMapper.materialsArray.length > 0) {
            GPUAPI.copyTexture(StaticFBO.postProcessing1, StaticFBO.postProcessing2, GPU.context.COLOR_BUFFER_BIT)
            StaticFBO.postProcessing2.use()
            UberMaterialAttributeGroup.clear()
            this.#render()
        }
        GPU.context.flush()
    }

    #render() {
        const toRender = MaterialResourceMapper.materialsArray
        const uniforms = UberShader.uberUniforms
        GPU.context.uniform1i(uniforms.isDecalPass, 0)
        GPUUtil.bind2DTextureForDrawing(uniforms.previousFrame, 3, StaticFBO.postProcessing1Sampler)
        const size = toRender.length
        for (let matIndex = 0; matIndex < size; matIndex++) {
            const materialGroup = toRender[matIndex]
            if (materialGroup.material.renderingMode !== MATERIAL_RENDERING_TYPES.TRANSPARENCY)
                continue
            const entities = materialGroup.entities
            const entitiesSize = entities.length
            for (let entityIndex = 0; entityIndex < entitiesSize; entityIndex++) {
                this.#renderEntity(entities[entityIndex])
            }
        }
        StaticFBO.postProcessing2.stopMapping()
    }

    #renderEntity(entity: Entity,) {
        const mesh = entity.meshRef
        const uniforms = UberShader.uberUniforms
        const context = GPU.context
        if (!entity.active || !mesh || entity.isCulled)
            return
        const culling = entity.cullingComponent
        const material = entity.materialRef

        UberMaterialAttributeGroup.screenDoorEffect = culling && culling.screenDoorEffect ? entity.__cullingMetadata[5] : 0
        UberMaterialAttributeGroup.entityID = entity.pickID
        UberMaterialAttributeGroup.materialID = material.bindID
        UberMaterialAttributeGroup.renderingMode = material.renderingMode
        UberMaterialAttributeGroup.ssrEnabled = material.ssrEnabled ? 1 : 0
        SceneRenderingUtil.bindComponentUniforms(entity, material, uniforms)

        context.uniformMatrix4fv(uniforms.materialAttributes, false, UberMaterialAttributeGroup.data)
        context.uniformMatrix4fv(uniforms.modelMatrix, false, entity.matrix)

        mesh.draw()
    }
}
