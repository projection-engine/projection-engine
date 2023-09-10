import GPUState from "../states/GPUState"
import Shader from "@engine-core/lib/resources/Shader"
import StaticFBOState from "../states/StaticFBOState"
import OShadowsSystem from "./OShadowsSystem"
import Material from "@engine-core/lib/resources/Material"
import UberShader from "../lib/UberShader"
import EngineState from "../states/EngineState"
import MeshComponent from "@engine-core/lib/components/MeshComponent";
import EntityManager from "@engine-core/managers/EntityManager";
import {Components, GLSLTypes} from "@engine-core/engine.enum";
import CameraState from "@engine-core/states/CameraState";

export default class SceneRenderingUtil {
	static #bindTexture(context: WebGL2RenderingContext, location: WebGLUniformLocation, index: number, sampler: WebGLTexture, cubeMap: boolean) {
		context.activeTexture(context.TEXTURE0 + index)
		context.bindTexture(cubeMap ? context.TEXTURE_CUBE_MAP : context.TEXTURE_2D, sampler)
		context.uniform1i(location, index)
	}


	static bindGlobalResources() {
		const uniforms = UberShader.uberUniforms
		const context = GPUState.context

		UberShader.uber.bind()
		if (EngineState.developmentMode)
			context.uniform1i(uniforms.shadingModel, EngineState.debugShadingModel)

		context.uniformMatrix4fv(uniforms.skyProjectionMatrix, false, CameraState.skyboxProjectionMatrix)
		context.uniform1f(uniforms.elapsedTime, EngineState.elapsed)
		context.uniformMatrix4fv(uniforms.viewMatrix, false, CameraState.viewMatrix)
		context.uniformMatrix4fv(uniforms.invViewMatrix, false, CameraState.invViewMatrix)
		context.uniformMatrix4fv(uniforms.viewProjection, false, CameraState.viewProjectionMatrix)
		context.uniform3fv(uniforms.cameraPosition, CameraState.position)

		SceneRenderingUtil.#bindTexture(context, uniforms.brdf_sampler, 0, GPUState.BRDF, false)
		SceneRenderingUtil.#bindTexture(context, uniforms.SSAO, 1, StaticFBOState.ssaoBlurredSampler, false)
		SceneRenderingUtil.#bindTexture(context, uniforms.SSGI, 2, StaticFBOState.ssgiSampler, false)
		SceneRenderingUtil.#bindTexture(context, uniforms.sceneDepth, 3, StaticFBOState.sceneDepthVelocity, false)

		SceneRenderingUtil.#bindTexture(context, uniforms.previousFrame, 4, StaticFBOState.lensSampler, false)
		SceneRenderingUtil.#bindTexture(context, uniforms.shadow_atlas, 5, StaticFBOState.shadowsSampler, false)
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
					Shader.bind(uniforms[current.key], dataAttribute.texture, <GLSLTypes>current.type, texOffset, () => texOffset++)
				else
					Shader.bind(uniforms[current.key], dataAttribute, <GLSLTypes>current.type, texOffset, () => texOffset++)
			}
	}

}
