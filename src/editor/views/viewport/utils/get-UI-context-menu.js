import ViewportActions from "../../../libs/ViewportActions";
import SelectionStore from "../../../stores/SelectionStore";
import {Engine} from "../../../../../public/engine/production";
import addUiElement from "./add-ui-element";

export default function getUIContextMenu() {
    return [
        {
            label: "New element",
            onClick: addUiElement
        },

        {divider: true},
        {
            label: "Select all",
            onClick: () => SelectionStore.engineSelected = Engine.entities.map(e => e.id),
            shortcut: ["A"]
        },
        {
            label: "Invert selection",
            onClick: () => ViewportActions.invertSelection(),
            shortcut: ["Ctrl", "I"]
        },
        {divider: true},
        {
            label: "Copy",
            onClick: () => ViewportActions.copy(false),
            icon: "copy_all",
            shortcut: ["Ctrl", "C"]
        },
        {
            label: "Paste",
            onClick: () => ViewportActions.paste(),
            icon: "content_paste_go",
            shortcut: ["Ctrl", "V"]
        },
        {divider: true},

        {
            shortcut: ["Delete"],
            icon: "delete_forever",
            label: "Delete",
            onClick: () => ViewportActions.deleteSelected()
        },

    ]
}