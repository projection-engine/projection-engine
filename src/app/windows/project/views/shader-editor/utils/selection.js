import SELECTION_TYPES from "../templates/SELECT_ACTIONS"

export default function selection(type, nodes, setSelected, selected) {
    switch (type) {
    case SELECTION_TYPES.INVERT: {
        const toSelect = []
        for (let i = 0; i < nodes.length; i++) {
            if (!selected.includes(nodes[i].id))
                toSelect.push(nodes[i].id)
        }
        setSelected(toSelect)
        break
    }
    case SELECTION_TYPES.NONE:
        setSelected([])
        break
    case SELECTION_TYPES.ALL: {
        setSelected(nodes.map(l => l.id))
        break
    }
    default:
        break
    }
}