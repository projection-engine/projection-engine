import SelectionStore from "../../stores/SelectionStore";
import QueryAPI from "../../../../public/engine/lib/utils/QueryAPI";
import SettingsStore from "../../stores/SettingsStore";
import GIZMOS from "../../static/GIZMOS";
import GizmoSystem from "../../lib/engine-tools/runtime/GizmoSystem";

export default function snap(grid) {
    const selected = SelectionStore.engineSelected
    for (let i = 0; i < selected.length; i++) {
        const entity = QueryAPI.getEntityByID(selected[i])
        const currentGizmo = SettingsStore.data.gizmo

        switch (currentGizmo) {
            case GIZMOS.TRANSLATION: {
                const g = grid ? grid : GizmoSystem.translationGizmo.gridSize
                entity._translation[0] = Math.round(entity._translation[0] / g) * g
                entity._translation[1] = Math.round(entity._translation[1] / g) * g
                entity._translation[2] = Math.round(entity._translation[2] / g) * g
                break
            }
            case GIZMOS.SCALE: {
                const g = grid ? grid : GizmoSystem.scaleGizmo.gridSize
                entity._scaling[0] = Math.round(entity._scaling[0] / g) * g
                entity._scaling[1] = Math.round(entity._scaling[1] / g) * g
                entity._scaling[2] = Math.round(entity._scaling[2] / g) * g
                break
            }
            case GIZMOS.ROTATION: {
                const g = grid ? grid : GizmoSystem.rotationGizmo.gridSize * toRad
                entity._rotationQuat[0] = Math.round(entity._rotationQuat[0] / g) * g
                entity._rotationQuat[1] = Math.round(entity._rotationQuat[1] / g) * g
                entity._rotationQuat[2] = Math.round(entity._rotationQuat[2] / g) * g
                entity._rotationQuat[3] = Math.round(entity._rotationQuat[2] / g) * g
                break
            }
        }
        entity.__changedBuffer[0] = 1
    }
}
