import GPU from "../GPU"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import ResourceEntityMapper from "../resource-libs/ResourceEntityMapper"
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import AbstractSystem from "../AbstractSystem";


export default class DShadowsSystem extends AbstractSystem {
	changed = false
	resolutionPerTexture = 1024
	maxResolution = 4096
	lightsToUpdate = []
	atlasRatio = 0


	execute() {
		const lightsToUpdate = this.lightsToUpdate
		if (!this.changed && lightsToUpdate.length === 0)
			return
		GPU.context.cullFace(GPU.context.FRONT)
		let currentColumn = 0, currentRow = 0

		StaticFBO.shadows.startMapping()
		GPU.context.enable(GPU.context.SCISSOR_TEST)
		const size = this.atlasRatio ** 2
		for (let face = 0; face < size; face++) {
			if (face < lightsToUpdate.length) {
				const currentLight = lightsToUpdate[face]

				GPU.context.viewport(
					currentColumn * this.resolutionPerTexture,
					currentRow * this.resolutionPerTexture,
					this.resolutionPerTexture,
					this.resolutionPerTexture
				)
				GPU.context.scissor(
					currentColumn * this.resolutionPerTexture,
					currentRow * this.resolutionPerTexture,
					this.resolutionPerTexture,
					this.resolutionPerTexture
				)


				currentLight.atlasFace = [currentColumn, 0]
				this.#loopMeshes(currentLight)
			}
			if (currentColumn > this.atlasRatio) {
				currentColumn = 0
				currentRow += 1
			} else
				currentColumn += 1
		}
		GPU.context.disable(GPU.context.SCISSOR_TEST)
		StaticFBO.shadows.stopMapping()
		GPU.context.cullFace(GPU.context.BACK)
		this.changed = false
		lightsToUpdate.length = 0
		MetricsController.currentState = METRICS_FLAGS.DIRECTIONAL_SHADOWS
	}

	#loopMeshes(light) {
		if (!light.entity)
			return
		const toRender = ResourceEntityMapper.meshes.array
		const size = toRender.length
		for (let m = 0; m < size; m++) {
			const current = toRender[m], meshComponent = current.meshComponent
			const mesh = current.meshRef
			if (!mesh || !meshComponent.castsShadows || !current.active || current.materialRef?.renderingMode === MATERIAL_RENDERING_TYPES.SKY)
				continue
			StaticShaders.directShadows.bind()
			const U = StaticShaders.directShadowsUniforms

			GPU.context.uniformMatrix4fv(U.viewMatrix, false, light.__lightView)
			GPU.context.uniformMatrix4fv(U.transformMatrix, false, current.matrix)
			GPU.context.uniformMatrix4fv(U.projectionMatrix, false, light.__lightProjection)

			mesh.draw()
		}
	}

}
