import PhysicsSystem from "../system/PhysicsSystem"
import StaticUBOs from "./StaticUBOs"
import VisibilityRendererSystem from "../system/VisibilityRendererSystem"
import EngineState from "../EngineState"
import GlobalIlluminationSystem from "../system/GlobalIlluminationSystem"
import StaticFBO from "./StaticFBO"
import DShadowsSystem from "../system/DShadowsSystem"


export default class EngineResources {
	static #INTEGER_BUFFER = new Uint8Array(1)
	static #FLOAT_BUFFER = new Float32Array(1)
	static #SSAO_BUFFER = new Float32Array([EngineState.ssaoRadius, EngineState.ssaoPower, EngineState.ssaoBias, EngineState.ssaoFalloffDistance])

	static updateParams() {
		PhysicsSystem.stop()
		PhysicsSystem.start()

		GlobalIlluminationSystem.getInstance().updateUniforms()

		StaticUBOs.uberUBO.bind()
		EngineResources.#FLOAT_BUFFER[0] = EngineState.ssrFalloff
		StaticUBOs.uberUBO.updateData("SSRFalloff", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.ssrStepSize
		StaticUBOs.uberUBO.updateData("stepSizeSSR", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.sssMaxDistance
		StaticUBOs.uberUBO.updateData("maxSSSDistance", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.sssDepthThickness
		StaticUBOs.uberUBO.updateData("SSSDepthThickness", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.sssEdgeFalloff
		StaticUBOs.uberUBO.updateData("SSSEdgeAttenuation", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.sssDepthDelta
		StaticUBOs.uberUBO.updateData("SSSDepthDelta", EngineResources.#FLOAT_BUFFER)
		EngineResources.#INTEGER_BUFFER[0] = EngineState.ssrMaxSteps
		StaticUBOs.uberUBO.updateData("maxStepsSSR", EngineResources.#INTEGER_BUFFER)
		EngineResources.#INTEGER_BUFFER[0] = EngineState.sssMaxSteps
		StaticUBOs.uberUBO.updateData("maxStepsSSS", EngineResources.#INTEGER_BUFFER)
		EngineResources.#INTEGER_BUFFER[0] = EngineState.ssaoEnabled ? 1 : 0
		StaticUBOs.uberUBO.updateData("hasAmbientOcclusion", EngineResources.#INTEGER_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.ssaoFalloffDistance
		StaticUBOs.uberUBO.updateData("SSAOFalloff", EngineResources.#FLOAT_BUFFER)
		StaticUBOs.uberUBO.unbind()


		EngineResources.#SSAO_BUFFER[0] = EngineState.ssaoRadius
		EngineResources.#SSAO_BUFFER[1] = EngineState.ssaoPower
		EngineResources.#SSAO_BUFFER[2] = EngineState.ssaoBias
		EngineResources.#SSAO_BUFFER[3] = EngineState.ssaoFalloffDistance

		StaticUBOs.ssaoUBO.bind()
		StaticUBOs.ssaoUBO.updateData("settings", EngineResources.#SSAO_BUFFER)
		StaticUBOs.ssaoUBO.unbind()


		StaticUBOs.frameCompositionUBO.bind()
		EngineResources.#FLOAT_BUFFER[0] = EngineState.fxaaSpanMax
		StaticUBOs.frameCompositionUBO.updateData("FXAASpanMax", EngineResources.#FLOAT_BUFFER)
		EngineResources.#INTEGER_BUFFER[0] = EngineState.fxaaEnabled ? 1 : 0
		StaticUBOs.frameCompositionUBO.updateData("useFXAA", EngineResources.#INTEGER_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.fxaaReduceMin
		StaticUBOs.frameCompositionUBO.updateData("FXAAReduceMin", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.fxaaReduceMul
		StaticUBOs.frameCompositionUBO.updateData("FXAAReduceMul", EngineResources.#FLOAT_BUFFER)
		StaticUBOs.frameCompositionUBO.unbind()

		VisibilityRendererSystem.needsUpdate = true
		EngineResources.#allocateDirectionalShadowsBuffers()

		DShadowsSystem.resolutionPerTexture = DShadowsSystem.maxResolution / (EngineState.shadowAtlasQuantity || 1)
		DShadowsSystem.atlasRatio = DShadowsSystem.maxResolution / DShadowsSystem.resolutionPerTexture
		StaticUBOs.uberUBO.bind()
		StaticUBOs.uberUBO.updateData("shadowMapsQuantity", new Float32Array([EngineState.shadowAtlasQuantity]))
		StaticUBOs.uberUBO.updateData("shadowMapResolution", new Float32Array([EngineState.shadowMapResolution]))
		StaticUBOs.uberUBO.unbind()
	}

	static #allocateDirectionalShadowsBuffers() {
		if (DShadowsSystem.maxResolution === EngineState.shadowMapResolution || EngineState.shadowMapResolution < 1024)
			return
		DShadowsSystem.maxResolution = EngineState.shadowMapResolution
		StaticFBO.updateDirectionalShadowsFBO()
		DShadowsSystem.changed = true
	}

}
