import SHADING_MODELS from "./SHADING_MODELS"
import GIZMOS from "./GIZMOS"
import TRANSFORMATION_TYPE from "./TRANSFORMATION_TYPE"
import VIEWS from "../../shared/components/view/VIEWS";
import VIEWPORT_TABS from "./VIEWPORT_TABS";


const toRad = Math.PI / 180
export default {

    projectCreationDate: (new Date()).toDateString(),
    loggingEnabled: true,
    iconsVisibility: true,
    gridVisibility: true,
    shadingModel: SHADING_MODELS.DETAIL,

    gizmo: GIZMOS.TRANSLATION,

    gamma: 2.2,
    exposure: 1,
    transformationType: TRANSFORMATION_TYPE.GLOBAL,
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
    ssgiNoiseScale: 2.,
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

    camera: {
        animated: true,
        movementSpeed: 1,
        scrollSpeed: 1,
        turnSpeed: 1,
    },

    gizmoGrid: {
        rotationGizmo:  Math.PI/180,
        translationGizmo: .01,
        scaleGizmo: .01
    },

    background: true,
    // VIEWS
    views: [
        {
            name: "Level",
            bottom: [VIEWS.FILES],
            left: [],
            viewport: VIEWPORT_TABS.EDITOR,
            right: [VIEWS.HIERARCHY, VIEWS.COMPONENT]
        },
        {
            name: "Debug",
            bottom: [VIEWS.CONSOLE],
            left: [],
            viewport: VIEWPORT_TABS.EDITOR,
            right: []
        },
        {
            name: "Shading",
            bottom: [VIEWS.BLUEPRINT],
            left: [],
            viewport: VIEWPORT_TABS.EDITOR,
            right: [VIEWS.HIERARCHY, VIEWS.COMPONENT]
        }
        ,
        {
            name: "UI",
            bottom: [VIEWS.FILES],
            left: [VIEWS.COMPONENT],
            viewport: VIEWPORT_TABS.UI,
            right: [VIEWS.HIERARCHY]
        }
    ],
    currentView: 0,
    INITIALIZED: false,
    visible: {
        metrics: true
    }
}