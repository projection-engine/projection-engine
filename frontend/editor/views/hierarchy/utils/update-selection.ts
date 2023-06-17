import SelectionStore from "../../../../shared/stores/SelectionStore"

export default function updateSelection(entityID:string, ctrlKey?:boolean) {
	if (ctrlKey) {
		if (!SelectionStore.engineSelected.includes(entityID))
			SelectionStore.engineSelected = [...SelectionStore.engineSelected, entityID]
		else
			SelectionStore.engineSelected = SelectionStore.engineSelected.filter(e => e !== entityID)
	} else
		SelectionStore.engineSelected = [entityID]
}