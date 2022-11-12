import SHADING_MODELS from "../../public/engine/editor-environment/static/SHADING_MODELS"
import GIZMOS from "./GIZMOS"
import TRANSFORMATION_TYPE from "./TRANSFORMATION_TYPE"
import TERRAIN_TOOLS from "./TERRAIN_TOOLS";
import KEYS from "./KEYS";
import INITIAL_LAYOUT from "./INITIAL_LAYOUT";


const toRad = Math.PI / 180
export default {

    resolution: [window.screen.width, window.screen.height],
    hideFooter: false,
    projectCreationDate: (new Date()).toDateString(),
    loggingEnabled: true,
    iconsVisibility: true,

    showGridSubdivision: true,
    gridOpacity: 1,
    gridVisibility: true,
    spawnDistanceFromCamera: 10,
    shadingModel: SHADING_MODELS.DETAIL,
    gizmo: GIZMOS.TRANSLATION,
    transformationType: TRANSFORMATION_TYPE.GLOBAL,
    backgroundColor: [.2, .2, .2],
    fov: 60 * toRad,
    zNear: .1,
    zFar: 5000,
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
        FORWARD_MOVEMENT_CAMERA: [KEYS.KeyW],
        BACKWARD_MOVEMENT_CAMERA: [KEYS.KeyS],
        LEFT_MOVEMENT_CAMERA: [KEYS.KeyA],
        RIGHT_MOVEMENT_CAMERA: [KEYS.KeyD],
        FASTER_MOVEMENT_CAMERA: [KEYS.ShiftLeft],


        HIDE_ACTIVE: [KEYS.AltLeft, KEYS.KeyH],
        DUPLICATE: [KEYS.ShiftLeft, KEYS.KeyD],
        SAVE: [KEYS.ControlLeft, KEYS.KeyS],
        INVERT_SELECTION: [KEYS.ControlLeft, KEYS.KeyI],
        SELECT_ALL: [KEYS.ControlLeft, KEYS.KeyA],
        SELECT_NONE: [KEYS.AltLeft, KEYS.KeyA],
        TRANSLATION_GIZMO: [KEYS.KeyG],
        SELECT_HIERARCHY: [KEYS.KeyH],

        FOCUS: [KEYS.Home],
        SCALE_GIZMO: [KEYS.KeyM],
        ROTATION_GIZMO: [KEYS.KeyR],
        UNDO: [KEYS.ControlLeft, KEYS.KeyZ],
        REDO: [KEYS.ControlLeft, KEYS.KeyY],
        GROUP: [KEYS.ControlLeft, KEYS.KeyP],
        FIXATE_ACTIVE: [KEYS.ControlLeft, KEYS.KeyF],
        COPY: [KEYS.ControlLeft, KEYS.KeyC],
        DELETE: [KEYS.Delete],
        PASTE: [KEYS.ControlLeft, KEYS.KeyV],


        SNAP_TO_GRID: [KEYS.ControlLeft, KEYS.KeyG],
        SNAP_TO_ORIGIN: [KEYS.ControlLeft, KEYS.KeyO],
        ROUND_TRANSFORMATION: [KEYS.ControlLeft, KEYS.KeyI],

        CYCLE_GIZMOS: [KEYS.Space],
        SWITCH_TRANSFORMATION: [KEYS.ControlLeft, KEYS.KeyT],


        CAMERA_TOP: [KEYS.Digit1],
        CAMERA_BOTTOM: [KEYS.Digit2],
        CAMERA_LEFT: [KEYS.Digit3],
        CAMERA_RIGHT: [KEYS.Digit4],
        CAMERA_FRONT: [KEYS.Digit5],
        FOCUS_ON_CAMERA: [KEYS.Digit0]
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
        cameraTranslation: [0, 0, 0],
        cameraRotation: [0, 0, 0, 1],
        movementSpeed: 1,
        smoothing: 1,
        rotationSmoothing: 1,
        turnSpeed: 1,
    },

    gizmoGrid: {
        rotationGizmo: Math.PI / 180,
        translationGizmo: 1,
        scaleGizmo: 1,
        sensitivity: .001
    },

    background: true,
    views: INITIAL_LAYOUT,
    currentView: 0,
    INITIALIZED: false
}