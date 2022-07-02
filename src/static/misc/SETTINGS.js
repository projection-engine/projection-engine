import SHADING_MODELS from "../../project/engine/templates/SHADING_MODELS"
import GIZMOS from "./GIZMOS"
import ROTATION_TYPES from "./ROTATION_TYPES"
import VIEWS from "../../components/view/VIEWS"

const toRad = Math.PI / 180
export default {
    projectCreationDate: (new Date()).toDateString(),
    timestamp: 30000,

    iconsVisibility: true,
    gridVisibility: true,
    shadingModel: SHADING_MODELS.DETAIL,

    resolutionMultiplier: 1,
    fullscreen: false,
    gizmo: GIZMOS.TRANSLATION,
    viewPreferences: false,
    filesVisibility: true,
    sceneVisibility: true,
    viewportOptionsVisibility: true,
    gamma: 2.2,
    exposure: 1,
    gridSize: .01,
    rotationType: ROTATION_TYPES.GLOBAL,
    iconSize: 1,
    bloomStrength: .3,
    bloomThreshold: .85,
    FXAASpanMax: 8,
    FXAAReduceMin: 1 / 128,
    FXAAReduceMul: 1 / 8,
    filmGrainStrength: .01,

    ssgiQuality: 50,
    ssgiBrightness: 1,
    ssgiStepSize: .5,
    ssr: true,
    ssgi: true,
    ssrStepSize: .1,
    ssrMaxSteps: 50,

    resolution: [window.screen.width, window.screen.height],
    frameRate: 75,
    distortion: false,
    chromaticAberration: false,
    preferencesVisibility: false,
    distortionStrength: 1,
    chromaticAberrationStrength: 1,

    ortho: false,
    fov: 60 * toRad,
    zNear: .1,
    zFar: 100000,
    gridRotationSize: 1,
    pcfSamples: 3.,
    shadowAtlasQuantity: 4,
    shadowMapResolution: 4096,
    total_strength: 3.5,
    base: 8,
    area: 12,
    falloff: 23,
    radius: 1,
    samples: 16,

    cameraAnimation: true,
    shortcuts: [],


    // VIEWS
    views: [{
        name: "Default",
        bottom: [VIEWS.FILES, VIEWS.CONSOLE],
        left: [],
        right: [VIEWS.HIERARCHY, VIEWS.COMPONENT] 
    }],
    currentView: 0
}