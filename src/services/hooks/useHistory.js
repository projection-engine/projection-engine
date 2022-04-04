import {ENTITY_ACTIONS} from "../utils/entityReducer";
import cloneClass from "../utils/misc/cloneClass";
import {useEffect, useReducer, useState} from "react";
import historyReducer, {HISTORY_ACTIONS} from "../utils/historyReducer";
import COMPONENTS from "../engine/templates/COMPONENTS";

export default function useHistory(entities, dispatchEntities) {
    const [currentChange, setCurrentChange] = useState()
    const [changes, dispatchChanges] = useReducer(historyReducer, [], () => [])
    useEffect(() => {
        setCurrentChange(changes.length)
    }, [changes])
    const forwardChanges = () => {
        let c = currentChange
        if (currentChange === undefined) {
            setCurrentChange(changes.length)
            c = changes.length - 1
        } else if (currentChange <= 10)
            setCurrentChange(prev => prev + 1)
        else if (c > changes.length)
            c = changes.length - 1
        if (c >= 0 && c <= 10) {
            switch (changes[c].type) {
                case HISTORY_ACTIONS.SAVE_COMPONENT_STATE:
                    dispatchEntities({
                        type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                            entityID: changes[c].entityID,
                            data: changes[c].component,
                            key: changes[c].componentKey
                        }
                    })
                    break
                case HISTORY_ACTIONS.PUSHING_DATA:
                    dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: changes[c].entities})
                    break
                case HISTORY_ACTIONS.DELETING_ENTITIES:
                    dispatchEntities({
                        type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: changes[c].entities.flat().map(e => e.id)
                    })
                    break
                default:
                    break
            }
        }
    }
    const returnChanges = () => {
        let c = currentChange - 1
        if (currentChange === undefined) {
            setCurrentChange(changes.length)
            c = changes.length - 1
        } else if (currentChange > 0)
            setCurrentChange(prev => prev - 1)
        if (c >= 0) {
            switch (changes[c].type) {
                case HISTORY_ACTIONS.SAVE_COMPONENT_STATE:
                    dispatchChanges({
                        type: HISTORY_ACTIONS.SAVE_COMPONENT_STATE, payload: {
                            key: changes[c].componentKey,
                            entityID: changes[c].entityID,
                            component: cloneClass(entities.find(e => e.id === changes[c].entityID).components[changes[c].componentKey])
                        }
                    })
                    dispatchEntities({
                        type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                            entityID: changes[c].entityID,
                            data: changes[c].component,
                            key: changes[c].componentKey
                        }
                    })
                    break
                case HISTORY_ACTIONS.PUSHING_DATA:
                    dispatchEntities({type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: changes[c].entities.map(e => e.id)})
                    break
                case HISTORY_ACTIONS.DELETING_ENTITIES:
                    console.log(changes[c].entities)
                    dispatchEntities({
                        type: ENTITY_ACTIONS.PUSH_BLOCK, payload: changes[c].entities.flat()
                    })
                    break
                default:
                    break
            }
        }
    }
    return {
        forwardChanges,
        returnChanges,
        changes,
        dispatchChanges
    }
}