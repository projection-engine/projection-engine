import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import SceneRenderingUtil from "./SceneRenderingUtil"
import UberMaterialAttributeGroup from "../resource-libs/UberMaterialAttributeGroup";
import UberShader from "../resource-libs/UberShader";
import GPU from "../GPU";
import loopMeshes from "./loop-meshes";
import EditorEntity from "../../tools/EditorEntity";
import Mesh from "../instances/Mesh";
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES";
import AbstractSystem from "../AbstractSystem";
import Material from "../instances/Material";

export default class OpaqueRendererSystem extends AbstractSystem {
    #stateWasCleared = false
    #isDoubleSided = false
    #isSky = false

    execute() {
        this.#isSky = this.#stateWasCleared = this.#isDoubleSided = false
        const context = GPU.context
        UberMaterialAttributeGroup.clear()
        context.uniform1i(UberShader.uberUniforms.isDecalPass, 0)
        loopMeshes(this.#opaqueCallback)
        MetricsController.currentState = METRICS_FLAGS.OPAQUE
    }

    #opaqueCallback(entity: EditorEntity, mesh: Mesh) {
        const uniforms = UberShader.uberUniforms
        const material = entity.materialRef
        const context = GPU.context
        const culling = entity?.cullingComponent
        UberMaterialAttributeGroup.screenDoorEffect = culling && culling.screenDoorEffect ? entity.__cullingMetadata[5] : 0
        UberMaterialAttributeGroup.entityID = entity.pickID

        if (this.#isSky) {
            this.#isSky = false
            context.enable(context.CULL_FACE)
            context.enable(context.DEPTH_TEST)
        }

        if (material !== undefined) {
            this.#withMaterial(entity, material)
        } else if (!this.#stateWasCleared) {
            this.#withNoMaterial()
        }

        context.uniformMatrix4fv(uniforms.materialAttributes, false, UberMaterialAttributeGroup.data)
        context.uniformMatrix4fv(uniforms.modelMatrix, false, entity.matrix)

        mesh.draw()
    }

    #withMaterial(entity: EditorEntity, material: Material) {
        const context = GPU.context
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

    #withNoMaterial() {
        this.#stateWasCleared = true
        if (this.#isDoubleSided) {
            GPU.context.enable(GPU.context.CULL_FACE)
            this.#isDoubleSided = false
        }

        UberMaterialAttributeGroup.ssrEnabled = 0
        UberMaterialAttributeGroup.renderingMode = MATERIAL_RENDERING_TYPES.ISOTROPIC
        UberMaterialAttributeGroup.materialID = -1
    }
}
