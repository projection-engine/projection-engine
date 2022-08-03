import deleteNode from "./delete-node"
import SELECTION_TYPES from "../templates/SELECT_ACTIONS"
import selection from "./selection"

export default function getContextMenu(nodes, setNodes, setSelected, selected, links, setLinks) {
    return [
        {
            label: "Select all",
            requiredTrigger: "data-board",
            onClick: () => selection(SELECTION_TYPES.ALL, nodes, setSelected, selected)
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
                deleteNode(node.getAttribute("data-node"), nodes, setNodes, links, setLinks, setSelected)
            }
        },
        {
            requiredTrigger: "data-link",
            label: "Delete link",
            icon: "delete",
            onClick: (node) =>links.filter(l => {
                const test = {
                    t: l.target.id + l.target.attribute.key,
                    s: l.source.id + l.source.attribute.key,
                }
                return (test.t + "-" + test.s) !== node.getAttribute("data-link")
            })
        },
        {
            requiredTrigger: "data-group",
            label: "Delete comment",
            icon: "delete",
            onClick: (node) => {
                const attr = node.getAttribute("data-group")

                setNodes(nodes.filter(pr => pr.id !== attr))
            }
        },

    ]
}