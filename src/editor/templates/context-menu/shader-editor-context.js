import deleteNode from "../../views/shader-editor/utils/delete-node"
import SELECTION_TYPES from "../../views/shader-editor/data/SELECT_ACTIONS"
import selection from "../../views/shader-editor/utils/selection"

export default function shaderEditorContext(nodes, setNodes, selected, links, setLinks, reference) {
    return [
        {
            label: "Select all",
            requiredTrigger: "data-board",
            onClick: () => selection(SELECTION_TYPES.ALL, nodes)
        },

        {
            label: "Center",
            requiredTrigger: "data-board",
            onClick: () => {
                const material = document.querySelector(`[data-ismaterial="true"]`)
                if (material) {
                    const transformation = material
                        .getAttribute("transform")
                        .replace("translate(", "")
                        .replace(")", "")
                        .split(" ")

                    reference.scrollLeft = parseInt(transformation[0]) - 10
                    reference.scrollTop = parseInt(transformation[1]) - 10

                }
            }
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
                deleteNode(node.getAttribute("data-node"), nodes, setNodes, links, setLinks)
            }
        },
        {
            requiredTrigger: "data-link",
            label: "Delete link",
            icon: "delete",
            onClick: (node) => {
                const toTest = node.getAttribute("data-link")
                setLinks(links.filter(l => {
                    if (!l?.target?.attribute || !l?.source?.attribute)
                        return false
                    const test = {
                        t: l.target.id + l.target.attribute.key,
                        s: l.source.id + l.source.attribute.key,
                    }

                    return (test.t + "-" + test.s) !== toTest
                }))
            }
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