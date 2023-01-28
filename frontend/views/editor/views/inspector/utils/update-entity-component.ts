import EditorActionHistory from "../../../lib/utils/EditorActionHistory";
import SelectionStore from "../../../stores/SelectionStore";
import LightsAPI from "../../../../../../engine-core/lib/utils/LightsAPI";
import EngineStore from "../../../stores/EngineStore";
import CameraAPI from "../../../../../../engine-core/lib/utils/CameraAPI";
import COMPONENTS from "../../../../../../engine-core/static/COMPONENTS";
import LightComponent from "../../../../../../engine-core/instances/components/LightComponent";

export default function updateEntityComponent(savedState, setSaved, entity, key, value, save, currentComponentValue) {
    if (currentComponentValue[1] instanceof LightComponent) {
        entity.needsLightUpdate = true
        LightsAPI.packageLights(true)
    }
    if (!savedState) {
        EditorActionHistory.save(entity)
        setSaved(true)
    }

    currentComponentValue[1][key] = value
    if (currentComponentValue[0] === COMPONENTS.CAMERA && entity.id === EngineStore.engine.focusedCamera)
        CameraAPI.updateViewTarget(entity)
    if (save) {
        SelectionStore.updateStore()
        EditorActionHistory.save(entity)
    }
}
