import UBO from "@engine-core/lib/resources/UBO"
import UberShader from "../lib/UberShader"
import GPUState from "./GPUState"

export enum StaticUBONames {
    CAMERA_VIEW = "CameraViewInfo",
    FRAME_COMPOSITION = "CompositionSettings",
    LENS_PP = "LensEffects",
    SSAO = "Settings",
    UBER = "UberShaderSettings",
    LIGHTS = "Lights",
    CAMERA_PROJECTION = "CameraProjectionInfo"
}

export default class StaticUBOState {
	static #initialized = false

	static cameraViewUBO?: UBO
	static frameCompositionUBO?: UBO
	static lensPostProcessingUBO?: UBO
	static ssaoUBO?: UBO
	static uberUBO?: UBO
	static lightsUBO?: UBO
	static cameraProjectionUBO?: UBO

	static initialize() {
		if (StaticUBOState.#initialized)
			return
		StaticUBOState.#initialized = true

		StaticUBOState.cameraViewUBO = new UBO(
			StaticUBONames.CAMERA_VIEW,
			[
				{name: "viewProjection", type: "mat4"},
				{name: "viewMatrix", type: "mat4"},
				{name: "invViewMatrix", type: "mat4"},
				{name: "placement", type: "vec4"},
			])

		StaticUBOState.cameraProjectionUBO = new UBO(
			StaticUBONames.CAMERA_PROJECTION,
			[
				{name: "projectionMatrix", type: "mat4"},
				{name: "invProjectionMatrix", type: "mat4"},
				{name: "bufferResolution", type: "vec2"},
				{name: "logDepthFC", type: "float"},
				{name: "logC", type: "float"},
			])

		StaticUBOState.frameCompositionUBO = new UBO(
			StaticUBONames.FRAME_COMPOSITION,
			[
				{type: "vec2", name: "inverseFilterTextureSize"},

				{type: "bool", name: "useFXAA"},
				{type: "bool", name: "filmGrainEnabled"},

				{type: "float", name: "FXAASpanMax"},
				{type: "float", name: "FXAAReduceMin"},
				{type: "float", name: "FXAAReduceMul"},
				{type: "float", name: "filmGrainStrength"},

			]
		)

		StaticUBOState.lensPostProcessingUBO = new UBO(
			StaticUBONames.LENS_PP,
			[
				{type: "float", name: "textureSizeXDOF"},
				{type: "float", name: "textureSizeYDOF"},
				{type: "float", name: "distortionIntensity"},
				{type: "float", name: "chromaticAberrationIntensity"},
				{type: "bool", name: "distortionEnabled"},
				{type: "bool", name: "chromaticAberrationEnabled"},
				{type: "bool", name: "bloomEnabled"},


				{type: "float", name: "focusDistanceDOF"},
				{type: "float", name: "apertureDOF"},
				{type: "float", name: "focalLengthDOF"},
				{type: "float", name: "samplesDOF"},

				{type: "bool", name: "vignetteEnabled"},
				{type: "float", name: "vignetteStrength"},
				{type: "float", name: "gamma"},
				{type: "float", name: "exposure"}
			]
		)

		const F32 = new Float32Array([2.2])
		StaticUBOState.lensPostProcessingUBO.bind()
		StaticUBOState.lensPostProcessingUBO.updateData("gamma", F32)
		F32[0] = 1
		StaticUBOState.lensPostProcessingUBO.updateData("exposure", F32)
		F32[0] = GPUState.internalResolution.w
		StaticUBOState.lensPostProcessingUBO.updateData("textureSizeXDOF", F32)
		F32[0] = GPUState.internalResolution.h
		StaticUBOState.lensPostProcessingUBO.updateData("textureSizeYDOF", F32)
		StaticUBOState.lensPostProcessingUBO.unbind()

		StaticUBOState.ssaoUBO = new UBO(
			StaticUBONames.SSAO,
			[
				{name: "settings", type: "vec4"},
				{name: "samples", type: "vec4", dataLength: 64},
				{name: "noiseScale", type: "vec2"}
			]
		)

		StaticUBOState.uberUBO = new UBO(
			StaticUBONames.UBER,
			[
				{name: "shadowMapsQuantity", type: "float"},
				{name: "shadowMapResolution", type: "float"},

				{name: "lightQuantity", type: "int"},
				{type: "float", name: "SSRFalloff"},
				{type: "float", name: "stepSizeSSR"},
				{type: "float", name: "maxSSSDistance"},
				{type: "float", name: "SSSDepthThickness"},
				{type: "float", name: "SSSEdgeAttenuation"},
				{type: "float", name: "skylightSamples"},
				{type: "float", name: "SSSDepthDelta"},
				{type: "float", name: "SSAOFalloff"},
				{type: "int", name: "maxStepsSSR"},
				{type: "int", name: "maxStepsSSS"},
				{type: "bool", name: "hasSkylight"},
				{type: "bool", name: "hasAmbientOcclusion"}
			]
		)
		StaticUBOState.lightsUBO = new UBO(
			StaticUBONames.LIGHTS,
			[
				{name: "lightPrimaryBuffer", type: "mat4", dataLength: UberShader.MAX_LIGHTS},
				{name: "lightSecondaryBuffer", type: "mat4", dataLength: UberShader.MAX_LIGHTS},
			]
		)
	}
}
