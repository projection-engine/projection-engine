import DirectionalLightComponent
    from "../../../../public/engine/templates/components/DirectionalLightComponent";
import PointLightComponent from "../../../../public/engine/templates/components/PointLightComponent";
import ActionHistoryAPI from "../../../libs/ActionHistoryAPI";
import SelectionStore from "../../../stores/SelectionStore";
import LightsAPI from "../../../../public/engine/api/LightsAPI";

export default function updateEntityComponent(savedState, setSaved, entity, key, value, save, currentComponentValue){
    if (currentComponentValue[1] instanceof DirectionalLightComponent || currentComponentValue[1] instanceof PointLightComponent) {
        entity.needsLightUpdate = true
        LightsAPI.packageLights(true)
    }
    if (!savedState) {
        ActionHistoryAPI.saveEntity(
            entity.id,
            currentComponentValue[0],
            key,
            value
        )
        setSaved(true)
    }
    currentComponentValue[1][key] = value
    if (save) {
        SelectionStore.updateStore()
        ActionHistoryAPI.saveEntity(
            entity.id,
            currentComponentValue[0],
            key,
            value
        )
    }
}
