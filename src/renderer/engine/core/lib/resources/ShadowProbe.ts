import {mat4} from "gl-matrix"
import getProbeRotation from "../../utils/get-probe-rotation"
import CubeMapManager from "../../managers/CubeMapManager"
import GPUState from "../../states/GPUState"
import AbstractMesh from "@engine-core/lib/resources/AbstractMesh";

const cacheMat4 = mat4.create()
export default class ShadowProbe implements IResource{
	texture
	_resolution

	constructor(resolution) {
		this.resolution = resolution
	}

	set resolution(data) {
		this._resolution = data
		this.texture = CubeMapManager.initializeTexture(true, data, false)
	}

	get resolution() {
		return this._resolution
	}

	draw(callback, zFar = 25, zNear = 1) {
		const resolution = this._resolution,
			texture = this.texture
		mat4.perspective(cacheMat4, Math.PI / 2, 1, zNear, zFar)

		AbstractMesh.finishIfUsed()
		const rbo = CubeMapManager.createRenderBuffer(resolution)
		GPUState.context.viewport(0, 0, resolution, resolution)
		for (let i = 0; i < 6; i++) {
			const rotations = getProbeRotation(i)
			GPUState.context.framebufferTexture2D(
				GPUState.context.FRAMEBUFFER,
				GPUState.context.DEPTH_ATTACHMENT,
				GPUState.context.TEXTURE_CUBE_MAP_POSITIVE_X + i,
				texture,
				0
			)
			GPUState.context.clear(GPUState.context.DEPTH_BUFFER_BIT)
			callback(rotations.yaw, rotations.pitch, cacheMat4, i)
		}

		GPUState.context.deleteRenderbuffer(rbo)
	}
}
