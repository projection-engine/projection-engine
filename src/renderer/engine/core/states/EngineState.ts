import LightComponent from "@engine-core/lib/components/LightComponent";

export default class EngineState{
	static fxaaEnabled = false
	static fxaaSpanMax = 8
	static fxaaReduceMin =  1 / 128
	static fxaaReduceMul =  1 / 8
	static ssgiEnabled = false
	static ssgiBlurSamples = 5
	static ssgiBlurRadius = 5
	static ssgiStepSize = 1
	static ssgiMaxSteps = 4
	static ssgiStrength = 1
	static ssrFalloff = 3
	static ssrStepSize = 1
	static ssrMaxSteps = 4
	static sssMaxDistance = .05
	static sssDepthThickness = .05
	static sssEdgeFalloff= 12
	static sssDepthDelta = 0
	static sssMaxSteps = 24
	static ssaoEnabled = false
	static ssaoFalloffDistance = 1000
	static ssaoRadius = .25
	static ssaoPower = 1
	static ssaoBias =  .1
	static ssaoBlurSamples = 2
	static ssaoMaxSamples = 64
	static physicsSubSteps = 10
	static physicsSimulationStep = 16.66666
	static shadowAtlasQuantity = 4
	static shadowMapResolution = 4096
	static debugShadingModel = 0
	static motionBlurEnabled  = false
	static motionBlurVelocityScale = 1
	static motionBlurMaxSamples = 50
	static shouldAOExecute = false

	static elapsed = 0
	static currentTimeStamp = 0

	static visibilityNeedsUpdate = false

	static directionalLightsChanged = false
	static directionalLightsResolutionPerTexture = 1024
	static directionalLightsMaxResolution = 4096
	static directionalLightsAtlasRatio = 0
	static directionalLightsToUpdate:LightComponent[] = []
	static omnidirectionalLightsToUpdate:LightComponent[] = []
	static cameraEntityTarget:EngineEntity|undefined
	static developmentMode = false

}
