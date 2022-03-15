import {useMemo, useState} from "react";
import CAMERA_TYPES from "../../../services/engine/utils/camera/CAMERA_TYPES";


export const SHADING_MODELS = {
    FLAT: 0,
    DETAIL: 1,
    WIREFRAME: 2
}
export default function useSettings() {

    const [settings, setSettings] = useState({
        projectCreationDate: (new Date()).toDateString(),
        timestamp: 30000,
        fxaa: true,
        iconsVisibility: true,
        gridVisibility: true,
        shadingModel: SHADING_MODELS.FLAT,
        fov: Math.PI / 2,
        fpsVisibility: true,
        resolutionMultiplier: 1,
        cameraType: CAMERA_TYPES.SPHERICAL,
        fullscreen: false,
        viewPreferences: false,
        filesVisibility: true,
        sceneVisibility: true,
        viewportOptionsVisibility: true,
        gamma: 2.2,
        exposure: 1.5
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