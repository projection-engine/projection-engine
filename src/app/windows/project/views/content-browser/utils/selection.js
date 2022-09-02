import SELECTION_TYPES from "../templates/SELECTION_TYPES"
import FilesStore from "../../../stores/FilesStore";
import SelectionStore from "../../../stores/SelectionStore";

export default function selection(type, currentDirectory) {
    const items = FilesStore.data.items
    if (SelectionStore.TARGET !== SelectionStore.TYPES.CONTENT_BROWSER)
        SelectionStore.updateTarget(SelectionStore.TYPES.CONTENT_BROWSER)
    switch (type) {
        case SELECTION_TYPES.INVERT: {
            const linked = items.filter(i => i.id.includes(currentDirectory.id))
            const toSelect = []

            for (let i = 0; i < linked.length; i++) {
                if (!SelectionStore.map.get(linked[i].id))
                    toSelect.push(linked[i].id)
            }
            SelectionStore.updateStore(toSelect)
            break
        }
        case SELECTION_TYPES.NONE:
            SelectionStore.updateStore([])
            break
        case SELECTION_TYPES.ALL: {
            const linked = items.filter(i => i.id.includes(currentDirectory.id))
            SelectionStore.updateStore(linked.map(l => l.id))
            break
        }
        default:
            break
    }
}