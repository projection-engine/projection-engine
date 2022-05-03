import CAMERA_TYPES from "../../../engine/editor/camera/CAMERA_TYPES";
import GIZMOS from "../../../engine/editor/gizmo/GIZMOS";
import RENDERING_TYPES from "../../../engine/templates/RENDERING_TYPES";
import useDirectState from "./useDirectState";
import ROTATION_TYPES from "../../../engine/editor/gizmo/ROTATION_TYPES";


export const SHADING_MODELS = {
    FLAT: 0,
    DETAIL: 1,
    WIREFRAME: 2
}
export default function useSettings() {
    const [state] = useDirectState({
        projectCreationDate: (new Date()).toDateString(),
        timestamp: 30000,

        typeRendering: RENDERING_TYPES.FXAA,

        iconsVisibility: true,
        gridVisibility: true,
        shadingModel: SHADING_MODELS.FLAT,
        fov: Math.PI / 2,
        fpsVisibility: true,
        resolutionMultiplier: 1,
        cameraType: CAMERA_TYPES.SPHERICAL,
        fullscreen: false,
        gizmo: GIZMOS.TRANSLATION,
        viewPreferences: false,
        filesVisibility: true,
        sceneVisibility: true,
        viewportOptionsVisibility: true,
        gamma: 2.2,
        exposure: 1.2,
        gridSize: .01,
        rotationType: ROTATION_TYPES.GLOBAL,

        bloomStrength: .3,
        bloomThreshold:  .85,
        FXAASpanMax:  8,
        FXAAReduceMin: 1 / 128,
        FXAAReduceMul:  1 / 8,
        filmGrainStrength: .01,

        resolution: [window.screen.width, window.screen.height],
        frameRate: 75,
        distortion: false,
        chromaticAberration: false,

        distortionStrength: 1,
        chromaticAberrationStrength: 1,

    })
    return state
}