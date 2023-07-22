import SHADING_MODELS from "../../../engine/core/static/SHADING_MODELS"
import GIZMOS from "../../../../shared/enums/Gizmos"
import GizmoTransformationType from "../../../../shared/enums/GizmoTransformationType"
import KEYS from "./KEYS"
import INITIAL_LAYOUT from "./INITIAL_LAYOUT"
import {glMatrix} from "gl-matrix"

export default {
	spawnOnOrigin: false,
	maxDistanceIcon: 50,
	cameraGizmoSize: 25,

	showOutline: true,
	showLines: true,
	showIcons: true,
	showGrid: true,
	outlineWidth: .5,
	outlineColor: [.5, .5, .5],
	hideFooter: false,
	projectCreationDate: (new Date()).toDateString(),

	screenSpaceMovement: false,
	gridOpacity: 1,
	gridColor: .3,
	gridScale: 1,
	gridThreshold: 100,
	iconScale: 1,
	spawnDistanceFromCamera: 10,
	shadingModel: SHADING_MODELS.DETAIL,
	gizmo: GIZMOS.TRANSLATION,
	transformationType: GizmoTransformationType.GLOBAL,
	backgroundColor: [.2, .2, .2],
	fov: glMatrix.toRadian(60),
	zNear: .1,
	zFar: 5000,

	viewportHotkeys: {
		FORWARD_MOVEMENT_CAMERA: [KEYS.KeyW],
		SHOW_SELECTED: [KEYS.ControlLeft, KEYS.KeyH],
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
		CREATE_COMMENT: [KEYS.KeyG],
		UNDO: [KEYS.ControlLeft, KEYS.KeyZ],
		REDO: [KEYS.ControlLeft, KEYS.KeyY],
		SAVE: [KEYS.ControlLeft, KEYS.KeyS],
		COPY: [KEYS.ControlLeft, KEYS.KeyC],
		DELETE: [KEYS.Delete],
		PASTE: [KEYS.ControlLeft, KEYS.KeyV],
		FOCUS: [KEYS.Home]
	},

	camera: {

		// PROPERTIES
		fov: 90,
		dynamicAspectRatio: true,
		aspectRatio: 1,
		zFar: 10000,
		zNear: .1,
		distortion: false,
		distortionStrength: 1,
		chromaticAberration: false,
		chromaticAberrationStrength: 1,
		vignette: false,
		vignetteStrength: .25,
		filmGrain: false,
		filmGrainStrength: 1,
		bloom: false,
		bloomThreshold: .75,
		bloomQuality: 8,
		bloomOffset: 0,
		gamma: 2.2,
		exposure: 1,
		motionBlurEnabled: false,
		cameraMotionBlur: false,
		ortho: false,
		size: 100,
		apertureDOF: 1.2,
		focalLengthDOF: 10,
		focusDistanceDOF: 100,
		samplesDOF: 100,
		enabledDOF: false,
		mbVelocityScale: 1,
		mbSamples: 50,

		screenSpaceMovementSpeed: 1,
		cameraTranslation: [0, 0, 0],
		cameraRotation: [0, 0, 0, 1],
		movementSpeed: 1,
		smoothing: 1,
		turnSpeed: .25,
	},

	gizmoGrid: {
		rotationGizmo: 1,
		translationGizmo: 1,
		scaleGizmo: 1,
		sensitivity: 1
	},

	background: true,
	views: INITIAL_LAYOUT,
	currentView: 0,
	INITIALIZED: false
}