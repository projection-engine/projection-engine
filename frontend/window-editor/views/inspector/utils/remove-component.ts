import SelectionStore from "../../../../shared/stores/SelectionStore"

import EntityHierarchyService from "../../../services/engine/EntityHierarchyService"

export default function removeComponent(entity,index, key) {
	if (!entity)
		return
	if (index != null) {
		entity.scripts[index] = undefined
		entity.scripts = entity.scripts.filter(e => e)
	} else
		entity.removeComponent(key)

	EntityHierarchyService.updateHierarchy()
	SelectionStore.updateStore()
}