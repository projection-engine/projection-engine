import SelectionStore from "../../../stores/SelectionStore";

import HierarchyController from "../../hierarchy/lib/HierarchyController";

export default function removeComponent(entity,index, key) {
    if (!entity)
        return
    if (index != null) {
        entity.scripts[index] = undefined
        entity.scripts = entity.scripts.filter(e => e)
    } else
        entity.removeComponent(key)

    HierarchyController.updateHierarchy()
    SelectionStore.updateStore()
}