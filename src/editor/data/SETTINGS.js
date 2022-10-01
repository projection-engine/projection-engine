import SHADING_MODELS from "../../../public/engine/editor/templates/SHADING_MODELS"
import GIZMOS from "./GIZMOS"
import TRANSFORMATION_TYPE from "./TRANSFORMATION_TYPE"
import VIEWS from "../../shared/components/view/VIEWS";
import VIEWPORT_TABS from "./VIEWPORT_TABS";
import TERRAIN_TOOLS from "./TERRAIN_TOOLS";
import KEYS from "../../../public/engine/static/KEYS";


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
    filmGrainStrength: .01,

    FXAASpanMax: 8,
    FXAAReduceMin: 1 / 128,
    FXAAReduceMul: 1 / 8,


    resolution: [window.screen.width, window.screen.height],

    distortion: false,
    chromaticAberration: false,
    preferencesVisibility: false,
    distortionStrength: 1,
    chromaticAberrationStrength: 1,
    backgroundColor: [.2, .2, .2],
    fov: 60 * toRad,
    zNear: .1,
    zFar: 5000,
    pcfSamples: 3.,
    shadowAtlasQuantity: 4,
    shadowMapResolution: 4096,
    terrainTool: TERRAIN_TOOLS.SCULPT,
    terrainSettings: {
        brushOnDecrease: true,
        brushSize: 5,
        brushStrength: .5,
        foliageDensity: 10,
        foliageQuantity: 1000,
        brushScale: .05
    },

    viewportHotkeys: {
        DUPLICATE: [KEYS.ShiftLeft, KEYS.KeyD],
        SAVE: [KEYS.ControlLeft, KEYS.KeyS],
        INVERT_SELECTION: [KEYS.ControlLeft, KEYS.KeyI],
        SELECT_ALL: [KEYS.KeyA],
        SELECT_NONE: [KEYS.AltLeft, KEYS.KeyA],
        TRANSLATION_GIZMO: [KEYS.KeyG],
        SELECT_HIERARCHY: [KEYS.KeyH],
        SNAP_TO_GRID: [KEYS.ShiftLeft, KEYS.ControlLeft, KEYS.Tab],
        FOCUS: [KEYS.Home],
        SCALE_GIZMO: [KEYS.KeyS],
        ROTATION_GIZMO: [KEYS.KeyR],
        UNDO: [KEYS.ControlLeft, KEYS.KeyZ],
        REDO: [KEYS.ControlLeft, KEYS.KeyY],
        GROUP: [KEYS.ControlLeft, KEYS.KeyP],
        FIXATE_ACTIVE: [KEYS.ControlLeft, KEYS.KeyF],
        COPY: [KEYS.ControlLeft, KEYS.KeyC],
        DELETE: [KEYS.Delete],
        PASTE: [KEYS.ControlLeft, KEYS.KeyV]
    },
    contentBrowserHotkeys: {
        BACK: [KEYS.AltLeft, KEYS.ArrowLeft],
        FORWARD: [KEYS.AltLeft, KEYS.ArrowRight],
        SELECT_ALL: [KEYS.KeyA],
        SELECT_NONE: [KEYS.AltLeft, KEYS.KeyA],
        INVERT_SELECTION: [KEYS.ControlLeft, KEYS.KeyI],
        REFRESH: [KEYS.F5],
        GO_TO_PARENT: [KEYS.Backspace],
        RENAME: [KEYS.F2],
        DELETE: [KEYS.Delete],
        CUT: [KEYS.ControlLeft, KEYS.KeyX],
        PASTE: [KEYS.ControlLeft, KEYS.KeyV]
    },
    shaderEditorHotkeys: {
        SELECT_ALL: [KEYS.KeyA],
        CREATE_GROUP: [KEYS.KeyG],
        SAVE: [KEYS.ControlLeft, KEYS.KeyS],
        COPY: [KEYS.ControlLeft, KEYS.KeyC],
        DELETE: [KEYS.Delete],
        PASTE: [KEYS.ControlLeft, KEYS.KeyV],
        FOCUS: [KEYS.Home]
    },

    camera: {
        animated: true,
        movementSpeed: 1,
        scrollSpeed: 1,
        turnSpeed: 1,
    },

    gizmoGrid: {
        rotationGizmo: Math.PI / 180,
        translationGizmo: 1,
        scaleGizmo: 1
    },


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

    background: true,
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