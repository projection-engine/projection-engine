import dispatchUiEntities from "../../../../stores/templates/dispatch-ui-entities";
import {ENTITY_ACTIONS} from "../../../../stores/templates/dispatch-renderer-entities";
import UIElement from "../../../../libs/engine/production/templates/basic/UIElement";
import UserInterfaceController from "../../../../libs/engine/production/UserInterfaceController";


function createElement(parent) {
    const entity = new UIElement()
    entity.parent = UserInterfaceController.entities.get(parent)
    if (entity.parent)
        entity.parent.children.push(entity)

    dispatchUiEntities({
        type: ENTITY_ACTIONS.ADD,
        payload: entity
    })
}

export default function getContextMenu() {

    return [
        {
            requiredTrigger: "data-self",
            label: "New Element",
            onClick: () => createElement()
        },
        {
            requiredTrigger: "data-node",
            label: "New Element",
            onClick: node => createElement(node.getAttribute("data-node"))
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
            onClick: (node) => dispatchUiEntities({
                type: ENTITY_ACTIONS.REMOVE,
                payload: node.getAttribute("data-node")
            })
        },

        {
            requiredTrigger: "data-node",
            label: "Focus",
            icon: "place",
            onClick: (target) => null // OUTLINE ELEMENT ON VIEWPORT
        },
    ]
}