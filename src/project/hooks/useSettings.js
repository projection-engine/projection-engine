import GIZMOS from "../extension/gizmo/GIZMOS";

import useDirectState from "./useDirectState";
import ROTATION_TYPES from "../extension/gizmo/ROTATION_TYPES";
import SHADING_MODELS from "../engine/templates/SHADING_MODELS";

const toRad = Math.PI / 180
export default function useSettings() {
    const [state] = useDirectState({
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

        resolution: [window.screen.width, window.screen.height],
        frameRate: 75,
        distortion: false,
        chromaticAberration: false,
        preferencesVisibility: false,
        distortionStrength: 1,
        chromaticAberrationStrength: 1,

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
    })
    return state
}