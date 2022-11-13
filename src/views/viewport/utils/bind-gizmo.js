import GIZMOS from "../../../static/GIZMOS";
import Engine from "../../../../public/engine/Engine";
import GizmoSystem from "../../../lib/engine-tools/runtime/GizmoSystem";
import Wrapper from "../../../lib/engine-tools/Wrapper";

export default function bindGizmo(selected, settings) {
    GizmoSystem.gizmoType = settings.gizmoSelection
    GizmoSystem.targetGizmoKey = settings.gizmo
    if (Wrapper.selected.length > 0) {
        switch (settings.gizmo) {
            case GIZMOS.TRANSLATION:
                GizmoSystem.targetGizmo = GizmoSystem.translationGizmo
                break
            case GIZMOS.ROTATION:
                GizmoSystem.targetGizmo = GizmoSystem.rotationGizmo
                break
            case GIZMOS.SCALE:
                GizmoSystem.targetGizmo = GizmoSystem.scaleGizmo
                break

        }
    } else if (GizmoSystem.targetGizmo) {
        GizmoSystem.targetGizmo.tracking = false;
        GizmoSystem.targetGizmo = undefined
    }
}