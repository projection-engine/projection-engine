export default {
    gamma: 2.2,
    exposure: 1,
    bloomStrength: .3,
    bloomThreshold: .85,
    filmGrainStrength: .01,

    FXAASpanMax: 8,
    FXAAReduceMin: 1 / 128,
    FXAAReduceMul: 1 / 8,


    physicsSubSteps: 10,
    physicsSimulationStep: 0.01666666,
    distortion: false,
    chromaticAberration: false,
    preferencesVisibility: false,
    distortionStrength: 1,
    chromaticAberrationStrength: 1,
    backgroundColor: [.2, .2, .2],

    shadowAtlasQuantity: 4,
    shadowMapResolution: 4096,

    SSGI: {
        enabled: true,
        maxSteps: 8,
        binarySearchSteps: 5,
        depthThreshold: 1.2,
        strength: .26,
        stepSize: .7
    },
    SSR: {
        enabled: true,
        maxSteps: 8,
        binarySearchSteps: 5,
        depthThreshold: 1.2,
        stepSize: 1
    },
    SSAO: {
        bias: .025,
        enabled: false,
        power: 1,
        radius: .5
    },
    INITIALIZED: false
}