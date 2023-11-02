import PhysicsSystem from "../system/PhysicsSystem"
import StaticUBOState from "../states/StaticUBOState"
import EngineState from "../states/EngineState"
import GlobalIlluminationSystem from "../system/GlobalIlluminationSystem"
import StaticFBOState from "../states/StaticFBOState"


export default class EngineResources {
	static #INTEGER_BUFFER = new Uint8Array(1)
	static #FLOAT_BUFFER = new Float32Array(1)
	static #SSAO_BUFFER = new Float32Array([EngineState.ssaoRadius, EngineState.ssaoPower, EngineState.ssaoBias, EngineState.ssaoFalloffDistance])

	static updateParams() {
		PhysicsSystem.stop()
		PhysicsSystem.start()

		GlobalIlluminationSystem.getInstance().updateUniforms()

		StaticUBOState.uberUBO.bind()
		EngineResources.#FLOAT_BUFFER[0] = EngineState.ssrFalloff
		StaticUBOState.uberUBO.updateData("SSRFalloff", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.ssrStepSize
		StaticUBOState.uberUBO.updateData("stepSizeSSR", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.sssMaxDistance
		StaticUBOState.uberUBO.updateData("maxSSSDistance", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.sssDepthThickness
		StaticUBOState.uberUBO.updateData("SSSDepthThickness", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.sssEdgeFalloff
		StaticUBOState.uberUBO.updateData("SSSEdgeAttenuation", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.sssDepthDelta
		StaticUBOState.uberUBO.updateData("SSSDepthDelta", EngineResources.#FLOAT_BUFFER)
		EngineResources.#INTEGER_BUFFER[0] = EngineState.ssrMaxSteps
		StaticUBOState.uberUBO.updateData("maxStepsSSR", EngineResources.#INTEGER_BUFFER)
		EngineResources.#INTEGER_BUFFER[0] = EngineState.sssMaxSteps
		StaticUBOState.uberUBO.updateData("maxStepsSSS", EngineResources.#INTEGER_BUFFER)
		EngineResources.#INTEGER_BUFFER[0] = EngineState.ssaoEnabled ? 1 : 0
		StaticUBOState.uberUBO.updateData("hasAmbientOcclusion", EngineResources.#INTEGER_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.ssaoFalloffDistance
		StaticUBOState.uberUBO.updateData("SSAOFalloff", EngineResources.#FLOAT_BUFFER)
		StaticUBOState.uberUBO.unbind()


		EngineResources.#SSAO_BUFFER[0] = EngineState.ssaoRadius
		EngineResources.#SSAO_BUFFER[1] = EngineState.ssaoPower
		EngineResources.#SSAO_BUFFER[2] = EngineState.ssaoBias
		EngineResources.#SSAO_BUFFER[3] = EngineState.ssaoFalloffDistance

		StaticUBOState.ssaoUBO.bind()
		StaticUBOState.ssaoUBO.updateData("settings", EngineResources.#SSAO_BUFFER)
		StaticUBOState.ssaoUBO.unbind()


		StaticUBOState.frameCompositionUBO.bind()
		EngineResources.#FLOAT_BUFFER[0] = EngineState.fxaaSpanMax
		StaticUBOState.frameCompositionUBO.updateData("FXAASpanMax", EngineResources.#FLOAT_BUFFER)
		EngineResources.#INTEGER_BUFFER[0] = EngineState.fxaaEnabled ? 1 : 0
		StaticUBOState.frameCompositionUBO.updateData("useFXAA", EngineResources.#INTEGER_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.fxaaReduceMin
		StaticUBOState.frameCompositionUBO.updateData("FXAAReduceMin", EngineResources.#FLOAT_BUFFER)
		EngineResources.#FLOAT_BUFFER[0] = EngineState.fxaaReduceMul
		StaticUBOState.frameCompositionUBO.updateData("FXAAReduceMul", EngineResources.#FLOAT_BUFFER)
		StaticUBOState.frameCompositionUBO.unbind()

		EngineState.visibilityNeedsUpdate = true
		EngineResources.#allocateDirectionalShadowsBuffers()

		EngineState.directionalLightsResolutionPerTexture = EngineState.directionalLightsMaxResolution / (EngineState.shadowAtlasQuantity || 1)
		EngineState.directionalLightsAtlasRatio = EngineState.directionalLightsMaxResolution / EngineState.directionalLightsResolutionPerTexture
		StaticUBOState.uberUBO.bind()
		StaticUBOState.uberUBO.updateData("shadowMapsQuantity", new Float32Array([EngineState.shadowAtlasQuantity]))
		StaticUBOState.uberUBO.updateData("shadowMapResolution", new Float32Array([EngineState.shadowMapResolution]))
		StaticUBOState.uberUBO.unbind()
	}

	static #allocateDirectionalShadowsBuffers() {
		if (EngineState.directionalLightsMaxResolution === EngineState.shadowMapResolution || EngineState.shadowMapResolution < 1024)
			return
		EngineState.directionalLightsMaxResolution = EngineState.shadowMapResolution
		StaticFBOState.updateDirectionalShadowsFBO()
		EngineState.directionalLightsChanged = true
	}

}
