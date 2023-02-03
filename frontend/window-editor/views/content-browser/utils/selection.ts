import SELECTION_TYPES from "../static/SELECTION_TYPES"
import FilesStore from "../../../../shared/stores/FilesStore";
import SelectionStore from "../../../../shared/stores/SelectionStore";

export default function selection(type, currentDirectory) {
    const items = FilesStore.data.items

    switch (type) {
        case SELECTION_TYPES.INVERT: {
            const linked = items.filter(i => i.id.includes(currentDirectory.id))
            const toSelect = []

            for (let i = 0; i < linked.length; i++) {
                if (!SelectionStore.map.get(linked[i].id))
                    toSelect.push(linked[i].id)
            }
            SelectionStore.contentBrowserSelected = toSelect
            break
        }
        case SELECTION_TYPES.NONE:
            SelectionStore.contentBrowserSelected = []
            break
        case SELECTION_TYPES.ALL: {
            const linked = items.filter(i => i.id.includes(currentDirectory.id))
            SelectionStore.contentBrowserSelected = linked.map(l => l.id)
            break
        }
        default:
            break
    }
}