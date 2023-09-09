import {mat4} from "gl-matrix"
import GPUState from "../../states/GPUState"
import CubeMapManager from "../../managers/CubeMapManager"
import getProbeRotation from "../../utils/get-probe-rotation"
import getProbeLookat from "../../utils/get-probe-lookat"
import StaticMeshesState from "../../states/StaticMeshesState"
import StaticShadersState from "../../states/StaticShadersState"
import AbstractMesh from "@engine-core/lib/resources/AbstractMesh";


const perspective = mat4.create()
export default class LightProbe implements IResource {
	texture?: WebGLTexture
	prefiltered?: WebGLTexture
	irradianceTexture?: WebGLTexture
	#resolution?: number

	constructor(resolution: number) {
		this.resolution = resolution
	}

	set resolution(data: number) {
		if (data === this.#resolution || typeof data !== "number")
			return
		this.#resolution = data
		if (this.texture instanceof WebGLTexture)
			GPUState.context.deleteTexture(this.texture)

		this.texture = CubeMapManager.initializeTexture(false, data, false)
	}

	get resolution(): number {
		return this.#resolution
	}

	drawDiffuseMap(sampler = this.texture, multiplier = [1, 1, 1]) {
		this.draw(
			(yaw, pitch, perspective) => {
				StaticShadersState.irradiance.bindForUse({
					projectionMatrix: perspective,
					viewMatrix: getProbeLookat(yaw, pitch, [0, 0, 0]),
					uSampler: sampler,
					multiplier
				})
				GPUState.context.drawArrays(GPUState.context.TRIANGLES, 0, 36)
			},
			undefined,
			undefined,
			true
		)
	}

	drawSpecularMap(mipLevels = 6, resolution = 128) {
		mat4.perspective(perspective, 1.57, 1, .1, 10)
		AbstractMesh.finishIfUsed()
		GPUState.context.viewport(0, 0, resolution, resolution)
		if (!this.prefiltered)
			this.prefiltered = CubeMapManager.initializeTexture(false, resolution, true)


		const rbo = CubeMapManager.createRenderBuffer(resolution)
		StaticMeshesState.cubeBuffer.enable()

		for (let i = 0; i < mipLevels; i++) {
			const currentRes = resolution * Math.pow(0.5, i)
			const roughness = i / (mipLevels - 1)
			GPUState.context.viewport(0, 0, currentRes, currentRes)
			for (let j = 0; j < 6; j++) {
				GPUState.context.renderbufferStorage(GPUState.context.RENDERBUFFER, GPUState.context.DEPTH_COMPONENT24, currentRes, currentRes)
				const rotations = getProbeRotation(j)
				GPUState.context.framebufferTexture2D(
					GPUState.context.FRAMEBUFFER,
					GPUState.context.COLOR_ATTACHMENT0,
					GPUState.context.TEXTURE_CUBE_MAP_POSITIVE_X + j,
					this.prefiltered,
					i
				)
				const shader = StaticShadersState.prefiltered
				const uniforms = shader.uniformMap
				shader.bind()
				GPUState.context.uniformMatrix4fv(uniforms.projectionMatrix, false, perspective)
				GPUState.context.uniformMatrix4fv(uniforms.viewMatrix, false, getProbeLookat(rotations.yaw, rotations.pitch, [0, 0, 0]))
				GPUState.context.uniform1f(uniforms.roughness, roughness)

				GPUState.context.activeTexture(GPUState.context.TEXTURE0)
				GPUState.context.bindTexture(GPUState.context.TEXTURE_CUBE_MAP, this.texture)
				GPUState.context.uniform1i(uniforms.environmentMap, 0)

				GPUState.context.drawArrays(GPUState.context.TRIANGLES, 0, 36)
			}
		}
		StaticMeshesState.cubeBuffer.disable()

		GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, null)
		GPUState.context.deleteRenderbuffer(rbo)
	}

	draw(callback: Function, zFar?: number, zNear?: number, asIrradiance?: boolean): LightProbe {
		let resolution = asIrradiance ? 32 : this.#resolution, texture
		mat4.perspective(perspective, Math.PI / 2, 1, zNear || 1, zFar || 25)


		GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, CubeMapManager.frameBuffer)
		GPUState.context.viewport(0, 0, resolution, resolution)

		const rbo = CubeMapManager.createRenderBuffer(resolution)

		if (!asIrradiance)
			texture = this.texture
		else {
			if (!this.irradianceTexture)
				this.irradianceTexture = CubeMapManager.initializeTexture(false, resolution)
			texture = this.irradianceTexture
		}

		if (asIrradiance) {
			AbstractMesh.finishIfUsed()
			StaticMeshesState.cubeBuffer.enable()
		}

		for (let i = 0; i < 6; i++) {
			const rotations = getProbeRotation(i)
			GPUState.context.framebufferTexture2D(
				GPUState.context.FRAMEBUFFER,
				GPUState.context.COLOR_ATTACHMENT0,
				GPUState.context.TEXTURE_CUBE_MAP_POSITIVE_X + i,
				texture,
				0
			)
			GPUState.context.clear(GPUState.context.COLOR_BUFFER_BIT | GPUState.context.DEPTH_BUFFER_BIT)

			callback(rotations.yaw, rotations.pitch, perspective, i)
		}
		if (asIrradiance)
			StaticMeshesState.cubeBuffer.disable()

		GPUState.context.deleteRenderbuffer(rbo)
		return this
	}

}
