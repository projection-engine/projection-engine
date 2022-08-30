import GIZMOS from "../../../data/misc/GIZMOS";
import RendererController from "../../../libs/engine/production/controllers/RendererController";
import GizmoSystem from "../../../libs/engine/editor/services/GizmoSystem";

export default function bindGizmo(selected, settings) {
    const entities = RendererController.entitiesMap
    GizmoSystem.selectedEntities = selected
        .map(s => entities.get(s))
        .filter(c => settings.gizmo === GIZMOS.TRANSLATION || settings.gizmo === GIZMOS.ROTATION && !c.lockedRotation || settings.gizmo === GIZMOS.SCALE && !c.lockedScaling)

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