import MetricsManager from "../managers/MetricsManager"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import SceneRenderingUtil from "./SceneRenderingUtil"
import UberMaterialAttributeGroup from "../lib/UberMaterialAttributeGroup";
import UberShader from "../lib/UberShader";
import GPUState from "../states/GPUState";
import loopMeshes from "./loop-meshes";
import Mesh from "@engine-core/lib/resources/Mesh";
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES";
import AbstractSystem from "../AbstractSystem";
import Material from "@engine-core/lib/resources/Material";
import CullingComponent from "@engine-core/lib/components/CullingComponent";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import EntityManager from "@engine-core/managers/EntityManager";

export default class OpaqueRendererSystem extends AbstractSystem {
    #stateWasCleared = false
    #isDoubleSided = false
    #isSky = false

    execute = () => {
        SceneRenderingUtil.bindGlobalResources()
        this.#isSky = this.#stateWasCleared = this.#isDoubleSided = false
        const context = GPUState.context
        UberMaterialAttributeGroup.clear()
        context.uniform1i(UberShader.uberUniforms.isDecalPass, 0)
        loopMeshes(this.#loop)
        MetricsManager.currentState = METRICS_FLAGS.OPAQUE
    }

    #loop = (entity: EngineEntity, mesh: Mesh, material: Material, transformComponent: TransformationComponent, cullingComponent: CullingComponent) => {

        const uniforms = UberShader.uberUniforms
        const context = GPUState.context
        UberMaterialAttributeGroup.screenDoorEffect = cullingComponent?.isScreenDoorEnabled ? 1 : 0
        UberMaterialAttributeGroup.entityID = EntityManager.getEntityPickVec3(entity)

        if (this.#isSky) {
            this.#isSky = false
            context.enable(context.CULL_FACE)
            context.enable(context.DEPTH_TEST)
        }

        if (material != null) {
            this.#withMaterial(entity, material)
        } else if (!this.#stateWasCleared) {
            this.#withNoMaterial()
        }

        context.uniformMatrix4fv(uniforms.materialAttributes, false, UberMaterialAttributeGroup.data)
        context.uniformMatrix4fv(uniforms.modelMatrix, false, transformComponent.matrix)
        mesh.draw()
    }

    #withMaterial = (entity: EngineEntity, material: Material) => {
        const context = GPUState.context
        if (material.renderingMode === MATERIAL_RENDERING_TYPES.TRANSPARENCY)
            return
        if (material.doubleSided) {
            context.disable(context.CULL_FACE)
            this.#isDoubleSided = true
        } else if (this.#isDoubleSided) {
            context.enable(context.CULL_FACE)
            this.#isDoubleSided = false
        }
        this.#isSky = material.renderingMode === MATERIAL_RENDERING_TYPES.SKY

        if (this.#isSky) {
            context.disable(context.CULL_FACE)
            context.disable(context.DEPTH_TEST)
        }
        UberMaterialAttributeGroup.materialID = material.bindID
        UberMaterialAttributeGroup.renderingMode = material.renderingMode
        UberMaterialAttributeGroup.ssrEnabled = material.ssrEnabled ? 1 : 0

        SceneRenderingUtil.bindComponentUniforms(entity, material, UberShader.uberUniforms)

        this.#stateWasCleared = false
    }

    #withNoMaterial = () => {
        this.#stateWasCleared = true
        if (this.#isDoubleSided) {
            GPUState.context.enable(GPUState.context.CULL_FACE)
            this.#isDoubleSided = false
        }

        UberMaterialAttributeGroup.ssrEnabled = 0
        UberMaterialAttributeGroup.renderingMode = MATERIAL_RENDERING_TYPES.ISOTROPIC
        UberMaterialAttributeGroup.materialID = -1
    }
}
