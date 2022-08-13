import SHADING_MODELS from "./SHADING_MODELS"
import GIZMOS from "./GIZMOS"
import TRANSFORMATION_TYPE from "./TRANSFORMATION_TYPE"
import VIEWS from "../../../../components/view/VIEWS";


const toRad = Math.PI / 180
export default {
    projectCreationDate: (new Date()).toDateString(),

    iconsVisibility: true,
    gridVisibility: true,
    shadingModel: SHADING_MODELS.DETAIL,

    gizmo: GIZMOS.TRANSLATION,

    gamma: 2.2,
    exposure: 1,
    transformationType: TRANSFORMATION_TYPE.GLOBAL,
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
    backgroundColor: [.2, .2, .2],
    fov: 60 * toRad,
    zNear: .1,
    zFar: 100000,
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
    background: true,
    // VIEWS
    views: [{
        name: "Default",
        bottom: [VIEWS.FILES, VIEWS.CONSOLE],
        left: [],
        right: [VIEWS.HIERARCHY, VIEWS.COMPONENT]
    }],
    currentView: 0,
    INITIALIZED: false,
    visible: {
        sideBarViewport: true,
        metrics: true
    }
}