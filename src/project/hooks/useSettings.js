import CAMERA_TYPES from "../engine-editor/camera/CAMERA_TYPES";
import GIZMOS from "../engine-editor/gizmo/GIZMOS";

import useDirectState from "./useDirectState";
import ROTATION_TYPES from "../engine-editor/gizmo/ROTATION_TYPES";
import SHADING_MODELS from "../engine/templates/SHADING_MODELS";

export default function useSettings() {
    const [state] = useDirectState({
        projectCreationDate: (new Date()).toDateString(),
        timestamp: 30000,

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
        preferencesVisibility: false,
        distortionStrength: 1,
        chromaticAberrationStrength: 1,

    })
    return state
}