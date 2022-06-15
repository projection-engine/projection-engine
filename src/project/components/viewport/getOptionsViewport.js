import {ENTITY_ACTIONS} from "../../engine-extension/entityReducer"
import COMPONENTS from "../../engine/templates/COMPONENTS"

export default function getOptionsViewport(engine, selected, selectedRef, utils) {
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
                engine.setSelected(engine.entities.filter(e => !e.isFolder).map(e => e.id))
            },
            shortcut: ["A"]
        },
        {
            label: "Invert selection",
            onClick: invertSelection,
            shortcut: ["Alt", "A"]
        }
    ]
    if(!selected)
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
            disabled: engine.selected.length === 1,
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
                engine.dispatchEntities({type: ENTITY_ACTIONS.REMOVE, payload: {entityID: selected}})
            },
            disabled: true
        },
        {divider: true},
        {
            label: "Apply current transformation",
            onClick: () => {
                const comp = selectedRef.components[COMPONENTS.TRANSFORM]
                comp.baseTransformationMatrix = comp.transformationMatrix

                comp.translation = [0, 0, 0]
                comp.scaling = [1, 1, 1]
                comp.rotationQuat = [0, 0, 0, 1]

                engine.dispatchEntities({
                    type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                    payload: {entityID: selected, data: comp, key: COMPONENTS.TRANSFORM}
                })
            }
        },
        {
            label: "Center on 3D cursor",
            onClick: () => {
                const comp = selectedRef.components[COMPONENTS.TRANSFORM]
                comp.translation = engine.cursor.components[COMPONENTS.TRANSFORM].translation
                engine.dispatchEntities({
                    type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                    payload: {entityID: selected, data: comp, key: COMPONENTS.TRANSFORM}
                })
            }
        },
        {
            label: "Origin to 3D cursor",
            onClick: () => {
                const comp = selectedRef.components[COMPONENTS.TRANSFORM]
                comp.pivotPoint = engine.cursor.components[COMPONENTS.TRANSFORM].translation
                engine.dispatchEntities({
                    type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                    payload: {entityID: selected, data: comp, key: COMPONENTS.TRANSFORM}
                })
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
            label: "Fixate active",
            onClick: () => {
                engine.setLockedEntity(selected)
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