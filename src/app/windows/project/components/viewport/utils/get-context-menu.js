import updateCursor from "./update-cursor"
import RendererStoreController from "../../../stores/RendererStoreController";
import ViewportActions from "../../../libs/ViewportActions";
import EditorRenderer from "../../../libs/engine/editor/EditorRenderer";

export default function getContextMenu(engine) {

    const base = [
        {
            label: "Select all",
            onClick: () => {
                RendererStoreController.updateEngine({
                    ...engine,
                    selected: window.renderer.entities.filter(e => !e.isFolder).map(e => e.id)
                })
            },
            shortcut: ["A"]
        },
        {
            label: "Invert selection",
            onClick: () => RendererStoreController.invertSelection(),
            shortcut: ["Ctrl", "I"]
        }
    ]
    if (!engine.selectedEntity)
        return base
    return [
        ...base,
        {
            label: "Copy",
            onClick: () => RendererStoreController.copy(false),
            icon: "copy_all",
            shortcut: ["Ctrl", "C"]
        },
        {
            label: "Paste",
            onClick: () => RendererStoreController.paste(),
            icon: "content_paste_go",
            shortcut: ["Ctrl", "V"]
        },
        {divider: true},
        {
            label: "Group entities",
            onClick: () => RendererStoreController.group(),
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
        // {
        //     label: "Duplicate entities",
        //     onClick: () => {
        //
        //     },
        //     disabled: true
        // },
        {divider: true},
        {
            label: "Apply current transformation",
            onClick: () => {
                const comp = engine.selectedEntity
                comp.baseTransformationMatrix = comp.transformationMatrix

                comp.translation = [0, 0, 0]
                comp.scaling = [1, 1, 1]
                comp.rotationQuaternion = [0, 0, 0, 1]
            }
        },
        {
            label: "Move to 3D cursor",
            onClick: () => {
                const comp = engine.selectedEntity
                comp.translation = [...EditorRenderer.cursor.translation]
            }
        },
        {
            label: "Pivot on 3D cursor",
            onClick: () => {
                const comp = engine.selectedEntity
                comp.pivotPoint = [...EditorRenderer.cursor.translation]
            }
        },
        {
            label: "3D cursor to origin",
            onClick: () => {
                const component = engine.selectedEntity
                if (component)
                    updateCursor(component.translation.slice(0, 3))
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
            onClick: () => ViewportActions.focus(engine.selectedEntity)
        },
        {
            label: "Fixate active",
            onClick: () => {
                engine.setLockedEntity(engine.selectedEntity.id)
            },
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
            onClick: () => RendererStoreController.deleteSelected()
        },

    ]
}