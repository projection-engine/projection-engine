import DirectionalLightComponent from "../../../../public/engine/lib/components/rendering/DirectionalLightComponent";
import PointLightComponent from "../../../../public/engine/lib/components/rendering/PointLightComponent";
import EntityAPI from "../../../../public/engine/lib/apis/EntityAPI";
import ActionHistoryAPI from "../../../libs/ActionHistoryAPI";
import SelectionStore from "../../../stores/SelectionStore";

export default function updateEntityComponent(savedState, setSaved, entity, key, value, save, currentComponentValue){
    if (currentComponentValue[1] instanceof DirectionalLightComponent || currentComponentValue[1] instanceof PointLightComponent) {
        entity.needsLightUpdate = true
        EntityAPI.packageLights(true)
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
