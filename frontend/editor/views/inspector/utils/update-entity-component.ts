import UndoRedoAPI from "../../../lib/utils/UndoRedoAPI";
import SelectionStore from "../../../stores/SelectionStore";
import LightsAPI from "../../../../../engine-core/lib/utils/LightsAPI";
import EngineStore from "../../../stores/EngineStore";
import CameraAPI from "../../../../../engine-core/lib/utils/CameraAPI";
import COMPONENTS from "../../../../../engine-core/static/COMPONENTS";
import ACTION_HISTORY_TARGETS from "../../../../static/ACTION_HISTORY_TARGETS";
import LightComponent from "../../../../../engine-core/templates/components/LightComponent";

export default function updateEntityComponent(savedState, setSaved, entity, key, value, save, currentComponentValue) {
    if (currentComponentValue[1] instanceof LightComponent) {
        entity.needsLightUpdate = true
        LightsAPI.packageLights(true)
    }
    if (!savedState) {
        UndoRedoAPI.save(entity, ACTION_HISTORY_TARGETS.ENGINE)
        setSaved(true)
    }

    currentComponentValue[1][key] = value
    if (currentComponentValue[0] === COMPONENTS.CAMERA && entity.id === EngineStore.engine.focusedCamera)
        CameraAPI.updateViewTarget(entity)
    if (save) {
        SelectionStore.updateStore()
        UndoRedoAPI.save(entity, ACTION_HISTORY_TARGETS.ENGINE)
    }
}
