import cloneClass from "../engine/utils/cloneClass";


export const HISTORY_ACTIONS = {
    SAVE_COMPONENT_STATE: 0,
    PUSHING_DATA: 1,
    DELETING_ENTITIES: 2
}

export default function historyReducer(state, {type, payload}) {
    let stateCopy = [...state]
    if (stateCopy.length === 10)
        stateCopy.shift()

    switch (type) {
        case HISTORY_ACTIONS.SAVE_COMPONENT_STATE: { // COMPONENT AND ENTITY ID
            stateCopy.push({
                type: HISTORY_ACTIONS.SAVE_COMPONENT_STATE,
                componentKey: payload.key,
                entityID: payload.entityID,
                component: cloneClass(payload.component)
            })
            return stateCopy
        }


        case HISTORY_ACTIONS.PUSHING_DATA:  // ADDED ENTITIES
            stateCopy.push({
                type: type,
                entities: payload
            })
            return stateCopy


        case HISTORY_ACTIONS.DELETING_ENTITIES: // RELATED ENTITIES AND ENTITY
            stateCopy.push({
                type: type,
                entities: payload.entitiesToDelete.map(e => {
                    return payload.entities.filter(ee => ee.id === e || ee.linkedTo === e)
                })
            })
            return stateCopy
        default:
            return stateCopy
    }
}
