export default {
    gamma: 2.2,
    exposure: 1,
    bloomStrength: .3,
    bloomThreshold: .85,
    filmGrainStrength: .01,

    FXAASpanMax: 8,
    FXAAReduceMin: 1 / 128,
    FXAAReduceMul: 1 / 8,


    resolution: [window.outerWidth, window.outerHeight],

    distortion: false,
    chromaticAberration: false,
    preferencesVisibility: false,
    distortionStrength: 1,
    chromaticAberrationStrength: 1,
    backgroundColor: [.2, .2, .2],

    pcfSamples: 3.,
    shadowAtlasQuantity: 4,
    shadowMapResolution: 4096,

    SSGI: {
        enabled: true,
        maxSteps: 50,
        binarySearchSteps: 5,
        depthThreshold: 1.2,
        strength: 1,
        stepSize: 1
    },
    SSR: {
        enabled: true,
        maxSteps: 50,
        binarySearchSteps: 5,
        depthThreshold: 1.2,
        stepSize: 1
    },
    SSAO: {
        enabled: false,
        power: 2,
        radius: 100
    },
    INITIALIZED: false
}