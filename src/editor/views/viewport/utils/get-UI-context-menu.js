import ViewportActions from "../../../libs/ViewportActions";
import TransformationAPI from "../../../../../public/engine/production/apis/math/TransformationAPI";
import SelectionStore from "../../../stores/SelectionStore";
import {vec3} from "gl-matrix";
import {COMPONENTS, Engine, Entity} from "../../../../../public/engine/production";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";

export default function getUIContextMenu() {
    return [
        {
            label: "New element",
            onClick: () =>  {
                const e = new Entity(undefined, "UI-Node")
                e.addComponent(COMPONENTS.UI)
                dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: e})
            }
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