import SceneRenderingUtil from "./SceneRenderingUtil"
import StaticFBO from "../lib/StaticFBO"
import UberMaterialAttributeGroup from "../resource-libs/UberMaterialAttributeGroup";
import UberShader from "../resource-libs/UberShader";
import GPU from "../GPU";
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES";
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";
import GPUAPI from "../lib/rendering/GPUAPI";
import loopMeshes from "@engine-core/system/loop-meshes";
import Mesh from "@engine-core/instances/Mesh";
import Material from "@engine-core/instances/Material";
import CullingComponent from "@engine-core/components/CullingComponent";
import TransformationComponent from "@engine-core/components/TransformationComponent";
import EntityManager from "@engine-core/EntityManager";

export default class TransparencyRendererSystem extends AbstractSystem {
    execute() {
        StaticFBO.postProcessing2.stopMapping()
        loopMeshes(this.#loop)
        StaticFBO.postProcessing2.stopMapping()
        GPU.context.flush()
    }

    #loop(entity: EngineEntity, mesh: Mesh, material: Material, transformComponent: TransformationComponent, cullingComponent: CullingComponent, index: number) {
        if (index === 0) {
            GPUAPI.copyTexture(StaticFBO.postProcessing1, StaticFBO.postProcessing2, GPU.context.COLOR_BUFFER_BIT)
            StaticFBO.postProcessing2.use()
            UberMaterialAttributeGroup.clear()
            GPU.context.uniform1i(UberShader.uberUniforms.isDecalPass, 0)
            GPUUtil.bind2DTextureForDrawing(UberShader.uberUniforms.previousFrame, 3, StaticFBO.postProcessing1Sampler)
        }
        if (!material || material.renderingMode !== MATERIAL_RENDERING_TYPES.TRANSPARENCY)
            return
        this.#renderEntity(entity, mesh, material, cullingComponent, transformComponent)
    }

    #renderEntity(entity: EngineEntity, mesh: Mesh, material: Material, cullingComponent: CullingComponent, transformationComponent: TransformationComponent) {
        const uniforms = UberShader.uberUniforms
        const context = GPU.context
        UberMaterialAttributeGroup.screenDoorEffect = cullingComponent?.isScreenDoorEnabled ? 1 : 0
        UberMaterialAttributeGroup.entityID = EntityManager.getEntityPickVec3(entity)
        UberMaterialAttributeGroup.materialID = material.bindID
        UberMaterialAttributeGroup.renderingMode = material.renderingMode
        UberMaterialAttributeGroup.ssrEnabled = material.ssrEnabled ? 1 : 0
        SceneRenderingUtil.bindComponentUniforms(entity, material, uniforms)

        context.uniformMatrix4fv(uniforms.materialAttributes, false, UberMaterialAttributeGroup.data)
        context.uniformMatrix4fv(uniforms.modelMatrix, false, transformationComponent.matrix)

        mesh.draw()
    }
}
