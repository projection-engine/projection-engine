import GizmoSystem from "../runtime/GizmoSystem";
import TRANSFORMATION_TYPE from "../../frontend/editor/static/TRANSFORMATION_TYPE.ts";
import ScreenSpaceGizmo from "../lib/transformation/ScreenSpaceGizmo";
import EngineTools from "../EngineTools";
import {vec3, vec4} from "gl-matrix";
import ScalingGizmo from "../lib/transformation/ScalingGizmo";
import AXIS from "../static/AXIS";

function getAxisMovement(event) {
    return Math.abs(event.movementX) > Math.abs(event.movementY) ? event.movementX : event.movementY
}

export default function gizmoScaleEntity(event) {
    let toApply, firstEntity = GizmoSystem.mainEntity
    if (!firstEntity)
        return;
    const axis = GizmoSystem.clickedAxis
    const isGlobal = GizmoSystem.transformationType === TRANSFORMATION_TYPE.GLOBAL
    const g = event.ctrlKey ? 1 : ScalingGizmo.gridSize
    let vec = [0, 0, 0]

    switch (axis) {
        case AXIS.SCREEN_SPACE:
            vec[0] = vec[1] = vec[2] = getAxisMovement(event) / 50
            break
        case AXIS.XY:
            vec[0] = vec[1] = getAxisMovement(event) / 50
            break
        case AXIS.XZ:
            vec[0] = vec[2] = getAxisMovement(event) / 50
            break
        case AXIS.ZY:
            vec[1] = vec[2] = getAxisMovement(event) / 50
            break
        default:
            vec = ScreenSpaceGizmo.onMouseMove(event, GizmoSystem.sensitivity)
            break
    }


    if (isGlobal || EngineTools.selected.length > 1)
        toApply = vec4.transformQuat([], [...vec, 1], firstEntity._rotationQuat)
    else
        toApply = vec
    vec3.add(ScalingGizmo.cache, ScalingGizmo.cache, toApply)

    let reversed
    if (isGlobal)
        reversed = vec3.scale([], ScalingGizmo.cache, -1)

    if (Math.abs(ScalingGizmo.cache[0]) >= g || Math.abs(ScalingGizmo.cache[1]) >= g || Math.abs(ScalingGizmo.cache[2]) >= g) {
        const entities = EngineTools.selected
        const SIZE = entities.length
        if (SIZE === 1 && entities[0].lockedScaling)
            return
        for (let i = 0; i < SIZE; i++) {
            const target = entities[i]
            if (target.lockedScaling)
                continue

            vec3.add(target._scaling, target._scaling, ScalingGizmo.cache)
            if (isGlobal && event.altKey)
                vec3.add(target._translation, target._translation, reversed)
            for (let j = 0; j < 3; j++)
                target._scaling[j] = Math.round(target._scaling[j] / g) * g
            target.__changedBuffer[0] = 1
        }
        ScalingGizmo.cache = [0, 0, 0]
    }
}