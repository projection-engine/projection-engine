import deleteNode from "./deleteNode"
import SELECTION_TYPES from "../templates/SELECTION_TYPES"
import selection from "./selection"

export default function getBoardOptions(pushNode, hook, links, deleteLink) {
    return [
        {
            label: "Select all",
            requiredTrigger: "data-board",
            onClick: () => selection(SELECTION_TYPES.ALL, hook)
        },
        // {
        //     label: "Select none",
        //     requiredTrigger: "data-board",
        //     onClick: () => selection(SELECTION_TYPES.NONE, hook)
        // },
        // {
        //     label: "Invert selection",
        //     requiredTrigger: "data-board",
        //     onClick: () => selection(SELECTION_TYPES.INVERT, hook)
        // },

        {
            requiredTrigger: "data-node",
            label: "Delete",
            icon: "delete",
            onClick: (node) => {
                deleteNode(node.getAttribute("data-node"), hook)
            }
        },
        {
            requiredTrigger: "data-link",
            label: "Delete link",
            icon: "delete",
            onClick: (node) => deleteLink(node.getAttribute("data-link"))
        },
        {
            requiredTrigger: "data-group",
            label: "Delete comment",
            icon: "delete",
            onClick: (node) => {
                const attr = node.getAttribute("data-group")
                hook.setChanged(true)
                hook.setNodes(prev => prev.filter(pr => pr.id !== attr))
            }
        },

    ]
}