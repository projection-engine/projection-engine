import Entity from "../engine/ecs/basic/Entity";
import Component from "../engine/ecs/basic/Component";
import PickComponent from "../engine/ecs/components/PickComponent";
import generateNextID from "./generateNextID";
import cloneClass from "./misc/cloneClass";
import Transformation from "../engine/utils/workers/Transformation";


export const ENTITY_ACTIONS = {
    ADD: 0,
    ADD_COMPONENT: 1,

    UPDATE: 2,
    UPDATE_COMPONENT: 3,

    REMOVE: 4,
    REMOVE_COMPONENT: 5,

    DISPATCH_BLOCK: 6,
    PUSH_BLOCK: 7,
    REMOVE_BLOCK: 8,
    CLEAR: 9,
    UPDATE_TRANSFORM: 10
}

function deleteEntity(entity, entities) {
    let copy = [...entities].filter(e => e.id !== entity.id)
    for (let i = 0; i < copy.length; i++) {
        if (copy[i].linkedTo === entity.id)
            copy = deleteEntity(copy[i], copy)
    }
    return copy
}

export default function entityReducer(state, action) {
    let stateCopy = [...state]
    const entityIndex = state.findIndex(e => e.id === action.payload?.entityID)

    if (entityIndex > -1) {
        const entity = cloneClass(stateCopy[entityIndex])
        switch (action.type) {

            // ENTITY
            case ENTITY_ACTIONS.UPDATE: {
                const {
                    key,
                    data,
                } = action.payload
                if (key === 'name')
                    entity.name = data
                else if (key === 'active')
                    entity.active = data
                else if (key === 'linkedTo')
                    entity.linkedTo = data

                stateCopy[entityIndex] = entity
                return stateCopy
            }
            case ENTITY_ACTIONS.REMOVE: {

                return deleteEntity(stateCopy[entityIndex], stateCopy)
            }

            // COMPONENT
            case ENTITY_ACTIONS.ADD_COMPONENT: {

                if (action.payload.data instanceof Component) {
                    if (action.payload instanceof PickComponent) {
                        const existing = state.filter(s => s.components.MeshComponent !== undefined)
                        action.payload.data.pickID = generateNextID(existing.length)
                    }


                    entity.addComponent(action.payload.data)
                }

                stateCopy[entityIndex] = entity
                return stateCopy
            }
            case ENTITY_ACTIONS.UPDATE_COMPONENT: {
                const {
                    key,
                    data,
                } = action.payload
                entity.components[key] = data

                stateCopy[entityIndex] = entity
                return stateCopy
            }
            case ENTITY_ACTIONS.REMOVE_COMPONENT: {
                entity.removeComponent(action.payload.constructor.name)
                stateCopy[entityIndex] = entity
                return stateCopy
            }
            default:
                return stateCopy
        }
    } else
        switch (action.type) {
            case ENTITY_ACTIONS.CLEAR:
                return []
            case ENTITY_ACTIONS.ADD: {
                if (action.payload instanceof Entity)
                    stateCopy.push(action.payload)

                return stateCopy
            }
            case ENTITY_ACTIONS.DISPATCH_BLOCK: {
                const block = action.payload
                if (Array.isArray(block))
                    return block
                else
                    return stateCopy
            }
            case ENTITY_ACTIONS.REMOVE_BLOCK: {
                const block = action.payload
                if (Array.isArray(block)) {
                    block.forEach(e => {
                        stateCopy.splice(stateCopy.findIndex(entity => entity.id === e), 1)
                    })
                    return stateCopy
                } else
                    return stateCopy
            }
            case ENTITY_ACTIONS.PUSH_BLOCK: {
                const block = action.payload
                if (Array.isArray(block))
                    return [...stateCopy, ...block]
                else
                    return stateCopy
            }
            case ENTITY_ACTIONS.UPDATE_TRANSFORM: {

                for (let i = 0; i < stateCopy.length; i++) {
                    const t = stateCopy[i].components.TransformComponent
                    if (t) {
                        const transform = Transformation.extractTransformations(t.transformationMatrix)
                        console.log(transform)
                        stateCopy[i].components.TransformComponent.translation = transform.translation
                        stateCopy[i].components.TransformComponent.scaling = transform.scaling
                        stateCopy[i].components.TransformComponent.rotation = transform.rotation
                        stateCopy[i].components.TransformComponent.changed = false
                    }
                }

                return stateCopy
            }

            default:
                return stateCopy
        }

}
