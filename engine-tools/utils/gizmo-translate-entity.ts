import ScreenSpaceGizmo from "../lib/transformation/ScreenSpaceGizmo";
import GizmoSystem from "../runtime/GizmoSystem";
import TRANSFORMATION_TYPE from "../../frontend/window-editor/static/TRANSFORMATION_TYPE";
import EngineTools from "../EngineTools";
import {vec3, vec4} from "gl-matrix";
import TranslationGizmo from "../lib/transformation/TranslationGizmo";
import AXIS from "../static/AXIS";
import GizmoAPI from "../lib/GizmoAPI";

const CACHE = vec4.create()
export default function gizmoTranslateEntity(event) {
    const firstEntity = GizmoSystem.mainEntity
    const LOCAL_CACHE = TranslationGizmo.cache
    if (!firstEntity)
        return;
    const g = event.ctrlKey ? 1 : TranslationGizmo.gridSize
    const vec = ScreenSpaceGizmo.onMouseMove(event)

    if (GizmoAPI.isGlobal)
        vec3.copy(<vec3>CACHE, vec)
    else
        vec4.transformQuat(CACHE, [vec[0], vec[1], vec[2], 1], firstEntity.rotationQuaternionFinal)


    vec3.add(LOCAL_CACHE, LOCAL_CACHE, <vec3>CACHE)
    if (Math.abs(LOCAL_CACHE[0]) >= g || Math.abs(LOCAL_CACHE[1]) >= g || Math.abs(TranslationGizmo.cache[2]) >= g) {
        const entities = EngineTools.selected
        const SIZE = entities.length
        if (SIZE === 1 && entities[0].lockedTranslation)
            return
        for (let i = 0; i < SIZE; i++) {
            const target = entities[i]
            if (target.lockedTranslation)
                continue
            if (SIZE === 1 && event.altKey) {
                vec3.add(target.pivotPoint, target.pivotPoint, LOCAL_CACHE)
                target.__pivotChanged = true
                continue
            }
            vec3.add(target._translation, target._translation, LOCAL_CACHE)
            target.__changedBuffer[0] = 1
        }
        LOCAL_CACHE.fill(0)
    }
}