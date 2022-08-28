import GIZMOS from "../../../data/misc/GIZMOS";
import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";
import RendererController from "../../../libs/engine/production/RendererController";
import GizmoSystem from "../../../libs/engine/editor/services/GizmoSystem";

export default function bindGizmo(selected, settings) {
    const gizmoSystem = window.renderer.editorSystem.gizmoSystem
    const entities = RendererController.entitiesMap
    GizmoSystem.selectedEntities = selected
        .map(s => entities.get(s))
        .filter(c => settings.gizmo === GIZMOS.TRANSLATION || settings.gizmo === GIZMOS.ROTATION && !c.lockedRotation || settings.gizmo === GIZMOS.SCALE && !c.lockedScaling)

    if (GizmoSystem.selectedEntities.length > 0) {
        switch (settings.gizmo) {
            case GIZMOS.TRANSLATION:
                GizmoSystem.targetGizmo = gizmoSystem.translationGizmo
                break
            case GIZMOS.ROTATION:
                GizmoSystem.targetGizmo = gizmoSystem.rotationGizmo
                break
            case GIZMOS.SCALE:
                GizmoSystem.targetGizmo = gizmoSystem.scaleGizmo
                break
        }
    } else if (GizmoSystem.targetGizmo) {
        GizmoSystem.targetGizmo.tracking = false;
        GizmoSystem.targetGizmo = undefined
    }
}