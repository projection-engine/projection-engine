import GizmoSystem from "../runtime/GizmoSystem";
import TRANSFORMATION_TYPE from "../../frontend/window-editor/static/TRANSFORMATION_TYPE";
import ScreenSpaceGizmo from "../lib/transformation/ScreenSpaceGizmo";
import EngineTools from "../EngineTools";
import {quat, vec3, vec4} from "gl-matrix";
import ScalingGizmo from "../lib/transformation/ScalingGizmo";
import AXIS from "../static/AXIS";

function getAxisMovement(event) {
    return Math.abs(event.movementX) > Math.abs(event.movementY) ? event.movementX : event.movementY
}

const cacheVec3 = vec3.create()
const vecCache = quat.create()
const cacheVec4 = quat.create()
export default function gizmoScaleEntity(event) {
    const CACHE = <vec3>ScalingGizmo.cache
    let firstEntity = GizmoSystem.mainEntity
    if (!firstEntity)
        return;
    const axis = GizmoSystem.clickedAxis
    const isGlobal = GizmoSystem.transformationType === TRANSFORMATION_TYPE.GLOBAL
    const g = event.ctrlKey ? 1 : ScalingGizmo.gridSize

    switch (axis) {
        case AXIS.SCREEN_SPACE:
            vecCache[0] = vecCache[1] = vecCache[2] = getAxisMovement(event) / 50
            break
        case AXIS.XY:
            vecCache[0] = vecCache[1] = getAxisMovement(event) / 50
            break
        case AXIS.XZ:
            vecCache[0] = vecCache[2] = getAxisMovement(event) / 50
            break
        case AXIS.ZY:
            vecCache[1] = vecCache[2] = getAxisMovement(event) / 50
            break
        default:
            const c = ScreenSpaceGizmo.onMouseMove(event)
            vecCache[0] = c[0]
            vecCache[1] = c[1]
            vecCache[2] = c[2]
            break
    }


    if (isGlobal || EngineTools.selected.length > 1) {
        vec4.transformQuat(cacheVec4, <vec4>vecCache, firstEntity._rotationQuat)
        vec3.add(CACHE, CACHE, <vec3>cacheVec4)
    } else
        vec3.add(CACHE, CACHE, <vec3>vecCache)


    if (isGlobal)
        vec3.scale(cacheVec3, CACHE, -1)

    if (Math.abs(CACHE[0]) >= g || Math.abs(CACHE[1]) >= g || Math.abs(CACHE[2]) >= g) {
        const entities = EngineTools.selected
        const SIZE = entities.length
        if (SIZE === 1 && entities[0].lockedScaling)
            return
        for (let i = 0; i < SIZE; i++) {
            const target = entities[i]
            if (target.lockedScaling)
                continue

            vec3.add(target._scaling, target._scaling, CACHE)
            if (isGlobal && event.altKey)
                vec3.add(target._translation, target._translation, cacheVec3)
            for (let j = 0; j < 3; j++)
                target._scaling[j] = Math.round(target._scaling[j] / g) * g
            target.__changedBuffer[0] = 1
        }
        CACHE[0] = 0
        CACHE[1] = 0
        CACHE[2] = 0
    }
}