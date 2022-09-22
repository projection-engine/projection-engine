import SELECTION_TYPES from "../data/SELECT_ACTIONS"
import SelectionStore from "../../../stores/SelectionStore";

export default function selection(type, nodes) {
    switch (type) {
    case SELECTION_TYPES.INVERT: {
        const toSelect = []
        for (let i = 0; i < nodes.length; i++) {
            if (!SelectionStore.shaderEditorSelected.includes(nodes[i].id))
                toSelect.push(nodes[i].id)
        }
        SelectionStore.shaderEditorSelected = toSelect
        break
    }
    case SELECTION_TYPES.NONE:
        SelectionStore.shaderEditorSelected = []
        break
    case SELECTION_TYPES.ALL: {
        SelectionStore.shaderEditorSelected = nodes.map(l => l.id)
        break
    }
    default:
        break
    }
}