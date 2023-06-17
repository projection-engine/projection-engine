export default {
	FXAA: false,
	TAA: false,
	FXAASpanMax: 8,
	FXAAReduceMin: 1 / 128,
	FXAAReduceMul: 1 / 8,
	resolutionX: window.screen.width,
	resolutionY: window.screen.height,
	physicsSubSteps: 10,
	physicsSimulationStep: 16.66666,

	preferencesVisibility: false,
	shadowAtlasQuantity: 4,
	shadowMapResolution: 4096,
	mbSamples: 50,

	SSGI: {
		blurRadius: 20,
		blurSamples: 15,
		enabled: true,
		maxSteps: 10,
		strength: 1,
		stepSize: .25
	},
	SSR: {
		enabled: true,
		maxSteps: 8,
		binarySearchSteps: 5,
		stepSize: .7,
		falloff: 3,
	},
	SSS: {
		depthDelta: -4,
		edgeFalloff: 12,
		maxSteps: 24,
		depthThickness: .05,
		maxDistance: .05,
	},
	SSAO: {

		blurSamples: 1,
		maxSamples: 64,
		bias: .1,
		enabled: false,
		power: 1,
		radius: .25,
		falloffDistance: 100
	},
	INITIALIZED: false
}