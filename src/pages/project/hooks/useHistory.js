import {ENTITY_ACTIONS} from "../../../engine/hooks/useEngineEssentials";
import {useEffect, useReducer, useState} from "react";
import historyReducer, {HISTORY_ACTIONS} from "./historyReducer";

export default function useHistory(entities, dispatchEntities, setAlert) {
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
                    setAlert({type: 'info', message: 'Undo: Changing component'})
                    dispatchEntities({
                        type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                            entityID: changes[c].entityID,
                            data: changes[c].component,
                            key: changes[c].componentKey
                        }
                    })
                    break
                case HISTORY_ACTIONS.PUSHING_DATA:
                    setAlert({type: 'info', message: 'Undo: Adding entities (' + changes[c].entities.length+ ')'})
                    dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: changes[c].entities})
                    break
                case HISTORY_ACTIONS.DELETING_ENTITIES:
                    setAlert({type: 'info', message: 'Undo: Deleting entities (' + changes[c].entities.length+ ')'})
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
                    setAlert({type: 'info', message: 'Redo: Changing component'})
                    dispatchEntities({
                        type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                            entityID: changes[c].entityID,
                            data: changes[c].component,
                            key: changes[c].componentKey
                        }
                    })
                    break
                case HISTORY_ACTIONS.PUSHING_DATA:
                    setAlert({type: 'info', message: 'Redo: Adding entities (' + changes[c].entities.length+ ')'})
                    dispatchEntities({type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: changes[c].entities.map(e => e.id)})
                    break
                case HISTORY_ACTIONS.DELETING_ENTITIES:
                    setAlert({type: 'info', message: 'Redo: Deleting entities (' + changes[c].entities.length+ ')'})
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