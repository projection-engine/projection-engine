import {useMemo, useState} from "react";
import CAMERA_TYPES from "../../../../services/engine/editor/camera/CAMERA_TYPES";
import GIZMOS from "../../../../services/engine/editor/gizmo/GIZMOS";
import RENDERING_TYPES from "../../../../services/engine/shared/templates/RENDERING_TYPES";


export const SHADING_MODELS = {
    FLAT: 0,
    DETAIL: 1,
    WIREFRAME: 2
}
export default function useSettings() {

    const [settings, setSettings] = useState({
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
        exposure: 1.5,
        gridSize: .01
    })
 
    return useMemo(() => {
        return new Proxy(settings, {
                get(obj, key) {
                    return obj[key];
                },
                set(obj, key, value) {
                    setSettings(prev => {
                        return {
                            ...prev,
                            [key]: value
                        }
                    })
                    return true
                }
            }
        )
    }, [settings])
}