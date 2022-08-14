function createComponent(component) {

}

function createElement(component) {

}

export default function getContextMenu(open, setOpen) {

    return [
        {
            requiredTrigger: "data-self",
            label: "New Component",
            onClick: () => createComponent()
        },
        {
            requiredTrigger: "data-node",
            label: "New Component",
            onClick: () => createComponent()
        },
        {
            requiredTrigger: "data-node",
            label: "New Element",
            onClick: () => createElement()
        },

        {divider: true, requiredTrigger: "data-self"},
        {
            requiredTrigger: "data-self",
            label: "Paste",
            onClick: () => null
        },

        {
            requiredTrigger: "data-node",
            label: "Paste",
            onClick: (target) => null
        },
        {
            requiredTrigger: "data-node",
            label: "Copy",
            onClick: (target) => null
        },

        {
            requiredTrigger: "data-node",
            label: "Duplicate",
            onClick: (target) => null
        },
        {
            requiredTrigger: "data-node",
            label: "Remove entity",
            icon: "delete",
            onClick: (node) => null
        },

        {
            requiredTrigger: "data-node",
            label: "Focus",
            icon: "place",
            onClick: (target) => null // OUTLINE ELEMENT ON VIEWPORT
        },
    ]
}