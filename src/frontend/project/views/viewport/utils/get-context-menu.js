import ViewportActions from "../../../libs/ViewportActions";
import TransformationAPI from "../../../../../../public/engine/production/apis/TransformationAPI";
import SelectionStore from "../../../stores/SelectionStore";

export default function getContextMenu() {
    return [

        {
            label: "Select all",
            onClick: () => SelectionStore.engineSelected = renderer.entities.filter(e => !e.isFolder).map(e => e.id),
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
                comp.baseTransformationMatrix = comp.transformationMatrix

                comp.translation = [0, 0, 0]
                comp.scaling = [1, 1, 1]
                comp.rotationQuaternion = [0, 0, 0, 1]
            }
        },
        {
            label: "Move to 3D cursor",
            onClick: () => {
                const comp = SelectionStore.selectedEntity
                comp.translation = [...window.engineCursor.translation]
            }
        },
        {
            label: "Pivot on 3D cursor",
            onClick: () => {
                const comp = SelectionStore.selectedEntity
                comp.pivotPoint = [...window.engineCursor.translation]
            }
        },
        {
            label: "3D cursor to origin",
            onClick: () => {
                const component = SelectionStore.selectedEntity
                if (component) {
                    const t = window.engineCursor
                    t.translation = [component.matrix[12], component.matrix[13], component.matrix[14]]
                    t.transformationMatrix = TransformationAPI.transform(t.translation, [0, 0, 0, 1], t.scaling)
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