import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import SceneRenderingUtil from "./SceneRenderingUtil"
import Renderer from "../Renderer"
import StaticFBO from "../lib/StaticFBO"
import UberMaterialAttributeGroup from "../resource-libs/UberMaterialAttributeGroup";
import UberShader from "../resource-libs/UberShader";
import GPU from "../GPU";
import loopMeshes from "./loop-meshes";
import Entity from "../instances/Entity";
import Mesh from "../instances/Mesh";
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES";
import MaterialResourceMapper from "../lib/MaterialResourceMapper";
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";

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

	#opaqueCallback(entity: Entity, mesh: Mesh) {
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

			SceneRenderingUtil.bindComponentUniforms(entity, material, uniforms)

			this.#stateWasCleared = false
		} else if (!this.#stateWasCleared) {
			this.#stateWasCleared = true
			if (this.#isDoubleSided) {
				context.enable(context.CULL_FACE)
				this.#isDoubleSided = false
			}

			UberMaterialAttributeGroup.ssrEnabled = 0
			UberMaterialAttributeGroup.renderingMode = MATERIAL_RENDERING_TYPES.ISOTROPIC
			UberMaterialAttributeGroup.materialID = -1
		}

		context.uniformMatrix4fv(uniforms.materialAttributes, false, UberMaterialAttributeGroup.data)
		context.uniformMatrix4fv(uniforms.modelMatrix, false, entity.matrix)

		mesh.draw()
	}
}
