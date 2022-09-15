import ViewportActions from "../../../libs/ViewportActions";
import TransformationAPI from "../../../../../public/engine/production/apis/math/TransformationAPI";
import SelectionStore from "../../../stores/SelectionStore";
import {vec3} from "gl-matrix";
import {Engine} from "../../../../../public/engine/production";

export default function getContextMenu() {
    return [

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
            label: "Group entities",
            onClick: () => ViewportActions.group(),
            shortcut: ["Ctrl", "P"]
        },
        {divider: true},
        {
            label: "Duplicate active",
            onClick: () => {

            },
            icon: "content_copy",
            disabled: true
        },

        {divider: true},
        {
            label: "Apply current transformation",
            onClick: () => {
                const comp = SelectionStore.selectedEntity
                comp.baseTransformationMatrix = comp.matrix

                comp.translation = [0, 0, 0]
                comp.scaling = [1, 1, 1]
                comp.rotationQuaternion = [0, 0, 0, 1]
            }
        },
        {
            label: "Move to 3D cursor",
            onClick: () => {
                const comp = SelectionStore.selectedEntity
                vec3.copy(comp.translation, window.engineCursor.translation)
            }
        },
        {
            label: "Pivot on 3D cursor",
            onClick: () => {
                const comp = SelectionStore.selectedEntity
                vec3.copy(comp.pivotPoint, window.engineCursor.translation)
            }
        },
        {
            label: "3D cursor to origin",
            onClick: () => {
                const component = SelectionStore.selectedEntity
                if (component) {
                    const t = window.engineCursor
                    vec3.copy(t.translation, component.absoluteTranslation)

                    t.matrix = TransformationAPI.transform(t.translation, [0, 0, 0, 1], t.scaling)
                }
            }
        },
        {divider: true},
        {
            label: "Rename active",
            onClick: () => {
            },
            icon: "edit",
            disabled: true,
            shortcut: ["F2"]
        },
        {
            label: "Focus",
            icon: "place",
            onClick: () => ViewportActions.focus(SelectionStore.selectedEntity)
        },
        {
            label: "Fixate active",
            onClick: () => SelectionStore.lockedEntity = SelectionStore.selectedEntity.id,
            icon: "push_pin",
            shortcut: ["Ctrl", "F"]
        },
        {divider: true},
        {
            label: "Snap to grid",
            onClick: () => {
            },
            disabled: true
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