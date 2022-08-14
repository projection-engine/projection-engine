import SELECTION_TYPES from "../templates/SELECTION_TYPES"
import CBStoreController from "../../../stores/CBStoreController";

export default function selection(type, currentDirectory, setSelected, selected) {
    const items = CBStoreController.data.items
    switch (type) {
    case SELECTION_TYPES.INVERT: {
        const linked = items.filter(i => i.id.includes(currentDirectory.id))
        const toSelect = []
        for (let i = 0; i < linked.length; i++) {
            if (!selected.includes(linked[i].id))
                toSelect.push(linked[i].id)
        }
        setSelected(toSelect)
        break
    }
    case SELECTION_TYPES.NONE:
        setSelected([])
        break
    case SELECTION_TYPES.ALL: {
        const linked = items.filter(i => i.id.includes(currentDirectory.id))
        setSelected(linked.map(l => l.id))
        break
    }
    default:
        break
    }
}