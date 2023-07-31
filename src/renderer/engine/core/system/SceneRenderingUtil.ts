import GPU from "../GPU"
import StaticMeshes from "../lib/StaticMeshes"
import type Entity from "../instances/Entity"
import Shader from "../instances/Shader"
import Engine from "../Engine"
import CameraAPI from "../lib/utils/CameraAPI"
import StaticFBO from "../lib/StaticFBO"
import OShadowsSystem from "./OShadowsSystem"
import UberMaterialAttributeGroup from "../resource-libs/UberMaterialAttributeGroup"
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES"
import Material from "../instances/Material"
import UberShader from "../resource-libs/UberShader"
import MaterialResourceMapper from "../lib/MaterialResourceMapper"
import ResourceEntityMapper from "../resource-libs/ResourceEntityMapper"
import Renderer from "../Renderer"
import Mesh from "../instances/Mesh"
import loopMeshes from "./loop-meshes"
import EngineState from "../EngineState"


let context, uniforms
export default class SceneRenderingUtil {
	static #bindTexture(context: WebGL2RenderingContext, location: WebGLUniformLocation, index: number, sampler: WebGLTexture, cubeMap: boolean) {
		context.activeTexture(context.TEXTURE0 + index)
		context.bindTexture(cubeMap ? context.TEXTURE_CUBE_MAP : context.TEXTURE_2D, sampler)
		context.uniform1i(location, index)
	}


	static bindGlobalResources() {
		const uniforms = UberShader.uberUniforms
		const context = GPU.context

		UberShader.uber.bind()
		if (Engine.developmentMode)
			context.uniform1i(uniforms.shadingModel, EngineState.debugShadingModel)


		context.uniformMatrix4fv(uniforms.skyProjectionMatrix, false, CameraAPI.skyboxProjectionMatrix)
		context.uniform1f(uniforms.elapsedTime, Renderer.elapsed)
		context.uniformMatrix4fv(uniforms.viewMatrix, false, CameraAPI.viewMatrix)
		context.uniformMatrix4fv(uniforms.invViewMatrix, false, CameraAPI.invViewMatrix)
		context.uniformMatrix4fv(uniforms.viewProjection, false, CameraAPI.viewProjectionMatrix)
		context.uniform3fv(uniforms.cameraPosition, CameraAPI.position)

		SceneRenderingUtil.#bindTexture(context, uniforms.brdf_sampler, 0, GPU.BRDF, false)
		SceneRenderingUtil.#bindTexture(context, uniforms.SSAO, 1, StaticFBO.ssaoBlurredSampler, false)
		SceneRenderingUtil.#bindTexture(context, uniforms.SSGI, 2, StaticFBO.ssgiSampler, false)
		SceneRenderingUtil.#bindTexture(context, uniforms.sceneDepth, 3, StaticFBO.sceneDepthVelocity, false)

		SceneRenderingUtil.#bindTexture(context, uniforms.previousFrame, 4, StaticFBO.lensSampler, false)
		SceneRenderingUtil.#bindTexture(context, uniforms.shadow_atlas, 5, StaticFBO.shadowsSampler, false)
		SceneRenderingUtil.#bindTexture(context, uniforms.shadow_cube, 6, OShadowsSystem.sampler, true)

		context.enable(context.CULL_FACE)
	}

	static bindComponentUniforms(entity: Entity, material: Material, uniforms: { [key: string]: WebGLUniformLocation }) {
		const component = entity.meshComponent
		const overrideUniforms = component.overrideMaterialUniforms
		const data = overrideUniforms ? component.mappedUniforms : material.uniformValues
		const toBind = material.uniforms
		let texOffset = 7
		if (data)
			for (let j = 0; j < toBind.length; j++) {
				const current = toBind[j]
				const dataAttribute = data[current.key]
				if (!dataAttribute)
					continue
				if (current.type === "sampler2D")
					Shader.bind(uniforms[current.key], dataAttribute.texture, current.type, texOffset, () => texOffset++)
				else
					Shader.bind(uniforms[current.key], dataAttribute, current.type, texOffset, () => texOffset++)
			}
	}

}
