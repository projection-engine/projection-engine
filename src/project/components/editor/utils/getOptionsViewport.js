import {ENTITY_ACTIONS} from "../../../engine/useEngineEssentials"
import COMPONENTS from "../../../engine/templates/COMPONENTS"

export default function getOptionsViewport(engine, selected, selectedRef, utils) {
    const {
        group,
        copy,
        paste
    } = utils
    return [
        {
            label: 'Copy active',
            onClick: () => copy(true),
            icon: 'copy_all'
        },
        {
            label: 'Copy',
            onClick: () => copy(true),
            icon: 'copy_all'
        },
        {
            label: 'Paste',
            onClick: paste,
            icon: 'content_paste_go'
        },
        {divider: true},
        {
            label: 'Group entities',
            onClick: group,
            disabled: engine.selected.length === 1
        },
        {divider: true},
        {
            label: 'Duplicate active',
            onClick: () => {

            },
            icon: 'content_copy',
            disabled: true
        },
        {
            label: 'Duplicate entities',
            onClick: () => {
                engine.dispatchEntities({type: ENTITY_ACTIONS.REMOVE, payload: {entityID: selected}})
            },
            disabled: true
        },
        {divider: true},
        {
            label: 'Set geometry to origin',
            onClick: () => {
                const comp = selectedRef.components[COMPONENTS.TRANSFORM]
                comp.baseTransformationMatrix = comp.transformationMatrix


                comp.translation = [0, 0, 0]
                comp.scaling = [1, 1, 1]
                comp.rotationQuat = [0, 0, 0, 1]

                comp.changed = true
                engine.dispatchEntities({
                    type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                    payload: {entityID: selected, data: comp, key: COMPONENTS.TRANSFORM}
                })
            },
            icon: 'place'
        },

        {divider: true},
        {
            label: 'Rename active',
            onClick: () => {

                engine.dispatchEntities({type: ENTITY_ACTIONS.REMOVE, payload: {entityID: selected}})
            },
            icon: 'delete_forever',
            disabled: true
        },
        {
            label: 'Fixate active',
            onClick: () => {
                engine.setLockedEntity(selected)
            },
            icon: 'push_pin'
        },
        {divider: true},
        {
            label: 'Snap to grid',
            onClick: () => {
                engine.dispatchEntities({type: ENTITY_ACTIONS.REMOVE, payload: {entityID: selected}})
            },
            disabled: true
        },
        {divider: true},
        {
            label: 'Delete',
            onClick: () => {
                const temp = [...engine.selected]
                engine.setSelected([])
                engine.dispatchEntities({type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: temp})
            }
        }
    ]
}