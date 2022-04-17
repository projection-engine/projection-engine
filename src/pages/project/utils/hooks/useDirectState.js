import RENDERING_TYPES from "../../../../engine/shared/templates/RENDERING_TYPES";
import CAMERA_TYPES from "../../../../engine/editor/camera/CAMERA_TYPES";
import GIZMOS from "../../../../engine/editor/gizmo/GIZMOS";
import {SHADING_MODELS} from "./useSettings";
import {useMemo, useState} from "react";

export default function useDirectState(initialState={}){
    const [state, setState] = useState(initialState)
    return [useMemo(() => {
        return new Proxy(state, {
                get(obj, key) {
                    return obj[key];
                },
                set(obj, key, value) {
                    setState(prev => {
                        return {
                            ...prev,
                            [key]: value
                        }
                    })
                    return true
                }
            }
        )
    }, [state]), () => setState({})]
}