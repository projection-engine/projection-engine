import SelectionStore from "../../../stores/SelectionStore";
import EngineStore from "../../../stores/EngineStore";
import {v4} from "uuid";

export default function removeComponent(index, key) {

    const entity = SelectionStore.selectedEntity
    if (!entity)
        return
    if (index != null) {
        entity.scripts[index] = undefined
        entity.scripts = entity.scripts.filter(e => e)
    } else
        entity.removeComponent(key)
    SelectionStore.updateStore()
    EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
}