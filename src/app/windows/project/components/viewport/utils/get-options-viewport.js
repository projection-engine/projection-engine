import updateCursor from "./update-cursor"
import COMPONENTS from "../../../libs/engine/data/COMPONENTS";

export default function getOptionsViewport(engine, utils) {
    const {
        group,
        copy,
        paste,
        invertSelection,
        deleteSelected
    } = utils
    const base = [
        {
            label: "Select all",
            onClick: () => {
                engine.setSelected(window.renderer.entities.filter(e => !e.isFolder).map(e => e.id))
            },
            shortcut: ["A"]
        },
        {
            label: "Invert selection",
            onClick: invertSelection,
            shortcut: ["Ctrl", "I"]
        }
    ]
    if (!engine.selectedEntity)
        return base
    return [
        ...base,
        {
            label: "Copy",
            onClick: () => copy(false),
            icon: "copy_all",
            shortcut: ["Ctrl", "C"]
        },
        {
            label: "Paste",
            onClick: paste,
            icon: "content_paste_go",
            shortcut: ["Ctrl", "V"]
        },
        {divider: true},
        {
            label: "Group entities",
            onClick: group,
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
        {
            label: "Duplicate entities",
            onClick: () => {

            },
            disabled: true
        },
        {divider: true},
        {
            label: "Apply current transformation",
            onClick: () => {
                const comp = engine.selectedEntity.components[COMPONENTS.TRANSFORM]
                comp.baseTransformationMatrix = comp.transformationMatrix

                comp.translation = [0, 0, 0]
                comp.scaling = [1, 1, 1]
                comp.rotationQuat = [0, 0, 0, 1]
            }
        },
        {
            label: "Move to 3D cursor",
            onClick: () => {
                const comp = engine.selectedEntity.components[COMPONENTS.TRANSFORM]
                comp.translation = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
            }
        },
        {
            label: "Pivot on 3D cursor",
            onClick: () => {
                const comp = engine.selectedEntity.components[COMPONENTS.TRANSFORM]
                comp.pivotPoint = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
            }
        },
        {
            label: "3D cursor to origin",
            onClick: () => {
                const component = engine.selectedEntity.components[COMPONENTS.TRANSFORM]
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
            onClick: () => {

                const entity = engine.selectedEntity
                const comp = entity ? entity.components[COMPONENTS.TRANSFORM] : undefined
                if (entity && comp) {
                    const t = comp.translation

                    window.renderer.camera.radius = 10
                    window.renderer.camera.centerOn = t

                    window.renderer.camera.updateViewMatrix()
                }
            }
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
            onClick: deleteSelected
        },

    ]
}