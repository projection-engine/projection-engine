import SelectionStore from "../../shared/stores/SelectionStore";
import QueryAPI from "../../../engine-core/lib/utils/QueryAPI";
import SettingsStore from "../../shared/stores/SettingsStore";
import GIZMOS from "../static/GIZMOS";
import GizmoSystem from "../../../engine-tools/runtime/GizmoSystem";

const toRad = Math.PI / 180
export default function snap(grid?: number) {
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
                entity._rotationQuaternion[0] = Math.round(entity._rotationQuaternion[0] / g) * g
                entity._rotationQuaternion[1] = Math.round(entity._rotationQuaternion[1] / g) * g
                entity._rotationQuaternion[2] = Math.round(entity._rotationQuaternion[2] / g) * g
                entity._rotationQuaternion[3] = Math.round(entity._rotationQuaternion[2] / g) * g
                break
            }
        }
        entity.changed = true
    }
}
