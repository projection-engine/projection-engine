import GIZMOS from "../../../data/GIZMOS";
import Engine from "../../../../public/engine/Engine";
import GizmoSystem from "../../../../public/engine/editor/services/GizmoSystem";

export default function bindGizmo(selected, settings) {
    const entities = Engine.entitiesMap
    GizmoSystem.selectedEntities = selected
        .map(s => entities.get(s))

    GizmoSystem.gizmoType = settings.gizmoSelection
    GizmoSystem.targetGizmoKey = settings.gizmo
    if (GizmoSystem.selectedEntities.length > 0) {
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