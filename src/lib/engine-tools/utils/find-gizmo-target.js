import getPivotPointMatrix from "./get-pivot-point-matrix";
import Wrapper from "../Wrapper";
import GizmoSystem from "../runtime/GizmoSystem";

export default function findGizmoTarget() {
    const main = Wrapper.selected[0]
    console.log(main, main === GizmoSystem.mainEntity)
    if (main && main === GizmoSystem.mainEntity)
        return
    if (!main)
        GizmoSystem.mainEntity = undefined
    else if (GizmoSystem.targetGizmo) {
        getPivotPointMatrix(main)
        main.__pivotChanged = true
        GizmoSystem.mainEntity = main
        GizmoSystem.targetGizmo.transformGizmo()
        GizmoSystem.targetRotation = main._rotationQuat
    }

}