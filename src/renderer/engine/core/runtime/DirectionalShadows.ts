import GPU from "../GPU"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import ResourceEntityMapper from "../resource-libs/ResourceEntityMapper"
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"


export default class DirectionalShadows {
	static changed = false
	static resolutionPerTexture = 1024
	static maxResolution = 4096
	static lightsToUpdate = []
	static atlasRatio = 0


	static execute() {
		const lightsToUpdate = DirectionalShadows.lightsToUpdate
		if (!DirectionalShadows.changed && lightsToUpdate.length === 0)
			return
		GPU.context.cullFace(GPU.context.FRONT)
		let currentColumn = 0, currentRow = 0

		StaticFBO.shadows.startMapping()
		GPU.context.enable(GPU.context.SCISSOR_TEST)
		const size = DirectionalShadows.atlasRatio ** 2
		for (let face = 0; face < size; face++) {
			if (face < lightsToUpdate.length) {
				const currentLight = lightsToUpdate[face]

				GPU.context.viewport(
					currentColumn * DirectionalShadows.resolutionPerTexture,
					currentRow * DirectionalShadows.resolutionPerTexture,
					DirectionalShadows.resolutionPerTexture,
					DirectionalShadows.resolutionPerTexture
				)
				GPU.context.scissor(
					currentColumn * DirectionalShadows.resolutionPerTexture,
					currentRow * DirectionalShadows.resolutionPerTexture,
					DirectionalShadows.resolutionPerTexture,
					DirectionalShadows.resolutionPerTexture
				)


				currentLight.atlasFace = [currentColumn, 0]
				DirectionalShadows.loopMeshes(currentLight)
			}
			if (currentColumn > DirectionalShadows.atlasRatio) {
				currentColumn = 0
				currentRow += 1
			} else
				currentColumn += 1
		}
		GPU.context.disable(GPU.context.SCISSOR_TEST)
		StaticFBO.shadows.stopMapping()
		GPU.context.cullFace(GPU.context.BACK)
		DirectionalShadows.changed = false
		lightsToUpdate.length = 0
		MetricsController.currentState = METRICS_FLAGS.DIRECTIONAL_SHADOWS
	}

	static loopMeshes(light) {
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