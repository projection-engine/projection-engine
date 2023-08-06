import GPU from "../GPU"
import type EditorEntity from "../../tools/EditorEntity"
import Shader from "../instances/Shader"
import Engine from "../Engine"
import CameraAPI from "../lib/utils/CameraAPI"
import StaticFBO from "../lib/StaticFBO"
import OShadowsSystem from "./OShadowsSystem"
import Material from "../instances/Material"
import UberShader from "../resource-libs/UberShader"
import EngineState from "../EngineState"
import MeshComponent from "@engine-core/components/MeshComponent";
import EntityManager from "@engine-core/EntityManager";
import {Components} from "@engine-core/engine.enum";

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
		context.uniform1f(uniforms.elapsedTime, EngineState.elapsed)
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
		SceneRenderingUtil.#bindTexture(context, uniforms.shadow_cube, 6, OShadowsSystem.getSampler(), true)

		context.enable(context.CULL_FACE)
	}

	static bindComponentUniforms(entity: EngineEntity, material: Material, uniforms: { [key: string]: WebGLUniformLocation }) {
		const component = EntityManager.getComponent(entity, Components.MESH) as MeshComponent
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