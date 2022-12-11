import UndoRedoAPI from "../../../lib/utils/UndoRedoAPI";
import SelectionStore from "../../../stores/SelectionStore";
import LightsAPI from "../../../../../public/engine/lib/rendering/LightsAPI";
import EngineStore from "../../../stores/EngineStore";
import CameraAPI from "../../../../../public/engine/lib/utils/CameraAPI";
import COMPONENTS from "../../../../../public/engine/static/COMPONENTS";
import ACTION_HISTORY_TARGETS from "../../../static/ACTION_HISTORY_TARGETS";
import LightComponent from "../../../../../public/engine/templates/components/LightComponent";

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
