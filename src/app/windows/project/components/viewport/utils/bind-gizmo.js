import GIZMOS from "../../../data/misc/GIZMOS";
import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
import RendererController from "../../../libs/engine/RendererController";
import GizmoSystem from "../../../libs/engine-extension/services/GizmoSystem";

export default  function bindGizmo(selected, settings) {
    const gizmoSystem = window.renderer.editorSystem.gizmoSystem
    const entities = RendererController.entitiesMap
    GizmoSystem.selectedEntities = selected
        .map(s => entities.get(s))
        .filter(c => (settings.gizmo === GIZMOS.TRANSLATION || c.components[COMPONENTS.TRANSFORM] && (settings.gizmo === GIZMOS.ROTATION && !c.components[COMPONENTS.TRANSFORM].lockedRotation || settings.gizmo === GIZMOS.SCALE && !c.components[COMPONENTS.TRANSFORM]?.lockedScaling)))

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
    }else if(GizmoSystem.targetGizmo){

        GizmoSystem.targetGizmo.exit()
        GizmoSystem.targetGizmo = undefined
    }
}