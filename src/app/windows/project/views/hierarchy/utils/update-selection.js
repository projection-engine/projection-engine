import SelectionStore from "../../../stores/SelectionStore";

export default function updateSelection(entity, ctrlKey) {
    if (ctrlKey) {
        if (!SelectionStore.engineSelected.includes(entity))
            SelectionStore.engineSelected = [...SelectionStore.engineSelected, entity]
        else
            SelectionStore.engineSelected = SelectionStore.engineSelected.filter(e => e !== entity)
    } else
        SelectionStore.engineSelected = [entity]
}