import Wrapper from "../Wrapper";
import GizmoSystem from "../runtime/GizmoSystem";
import {quat, vec3} from "gl-matrix";
import TRANSFORMATION_TYPE from "../../../static/TRANSFORMATION_TYPE";
import RotationGizmo from "../lib/transformation/RotationGizmo";

export default function gizmoRotateEntity(vec, screenSpace) {
    const targets = Wrapper.selected, SIZE = targets.length
    if (SIZE === 1 && GizmoSystem.mainEntity.lockedRotation)
        return
    const quatA = quat.create()
    if (screenSpace)
        RotationGizmo.currentRotation = vec
    else
        vec3.add(RotationGizmo.currentRotation, RotationGizmo.currentRotation, vec)
    if (vec[0] !== 0)
        quat.rotateX(quatA, quatA, vec[0])
    if (vec[1] !== 0)
        quat.rotateY(quatA, quatA, vec[1])
    if (vec[2] !== 0)
        quat.rotateZ(quatA, quatA, vec[2])

    for (let i = 0; i < SIZE; i++) {
        const target = targets[i]
        if (target.lockedRotation)
            continue
        if (screenSpace) {
            quat.copy(target._rotationQuat, quatA)
            continue
        }
        const translated = vec3.sub([], target._translation, target.pivotPoint)
        vec3.add(target._translation, vec3.transformQuat([], translated, quatA), target.pivotPoint)

        if (GizmoSystem.transformationType === TRANSFORMATION_TYPE.GLOBAL || SIZE > 1)
            quat.multiply(target._rotationQuat, quatA, target._rotationQuat)
        else
            quat.multiply(target._rotationQuat, target._rotationQuat, quatA)
        target.changed = true
    }
}