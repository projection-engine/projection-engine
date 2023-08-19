import SceneRenderingUtil from "./SceneRenderingUtil"
import StaticFBOState from "../states/StaticFBOState"
import UberMaterialAttributeGroup from "../lib/UberMaterialAttributeGroup";
import UberShader from "../lib/UberShader";
import GPU from "../GPU";
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES";
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";
import GPUManager from "../managers/GPUManager";
import loopMeshes from "@engine-core/system/loop-meshes";
import Mesh from "@engine-core/lib/resources/Mesh";
import Material from "@engine-core/lib/resources/Material";
import CullingComponent from "@engine-core/lib/components/CullingComponent";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import EntityManager from "@engine-core/managers/EntityManager";

export default class TransparencyRendererSystem extends AbstractSystem {
    execute() {
        StaticFBOState.postProcessing2.stopMapping()
        loopMeshes(this.#loop)
        StaticFBOState.postProcessing2.stopMapping()
        GPU.context.flush()
    }

    #loop(entity: EngineEntity, mesh: Mesh, material: Material, transformComponent: TransformationComponent, cullingComponent: CullingComponent, index: number) {
        if (index === 0) {
            GPUManager.copyTexture(StaticFBOState.postProcessing1, StaticFBOState.postProcessing2, GPU.context.COLOR_BUFFER_BIT)
            StaticFBOState.postProcessing2.use()
            UberMaterialAttributeGroup.clear()
            GPU.context.uniform1i(UberShader.uberUniforms.isDecalPass, 0)
            GPUUtil.bind2DTextureForDrawing(UberShader.uberUniforms.previousFrame, 3, StaticFBOState.postProcessing1Sampler)
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
