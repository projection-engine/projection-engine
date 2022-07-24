import SELECTION_TYPES from "../templates/SELECTION_TYPES"

export default function selection(type, hook, setSelected, selected) {
    switch (type) {
    case SELECTION_TYPES.INVERT: {
        const linked = hook.items.filter(i => i.id.includes(hook.currentDirectory.id))
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
        const linked = hook.items.filter(i => i.id.includes(hook.currentDirectory.id))
        setSelected(linked.map(l => l.id))
        break
    }
    default:
        break
    }
}