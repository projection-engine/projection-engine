import SELECTION_TYPES from "../templates/SELECT_ACTIONS"

export default function selection(type, hook) {
    switch (type) {
    case SELECTION_TYPES.INVERT: {
        const toSelect = []
        for (let i = 0; i < hook.nodes.length; i++) {
            if (!hook.selected.includes(hook.nodes[i].id))
                toSelect.push(hook.nodes[i].id)
        }
        hook.setSelected(toSelect)
        break
    }
    case SELECTION_TYPES.NONE:
        hook.setSelected([])
        break
    case SELECTION_TYPES.ALL: {
        hook.setSelected(hook.nodes.map(l => l.id))
        break
    }
    default:
        break
    }
}