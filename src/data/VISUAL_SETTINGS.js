export default {
    gamma: 2.2,
    exposure: 1,
    bloomStrength: .3,
    bloomThreshold: .85,
    filmGrainStrength: .01,
    mbVelocityScale: 1,
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
        strength: .26,
        stepSize: .7
    },
    SSR: {
        enabled: true,
        maxSteps: 8,
        binarySearchSteps: 5,
        stepSize: .7,
        falloff: 3,
        minRayStep: .1
    },
    motionBlurEnabled: true,
    SSAO: {
        bias: .025,
        enabled: false,
        power: 1,
        radius: .5
    },
    INITIALIZED: false
}