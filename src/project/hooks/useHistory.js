import {ENTITY_ACTIONS} from "../engine-extension/entityReducer"
import {useCallback, useEffect, useReducer, useState} from "react"
import historyReducer, {HISTORY_ACTIONS} from "./historyReducer"

export default function useHistory(entities, dispatchEntities) {
    const [currentChange, setCurrentChange] = useState()
    const [changes, dispatchChanges] = useReducer(historyReducer, [], () => [])
    useEffect(() => {
        setCurrentChange(changes.length)
    }, [changes])
    const forwardChanges = useCallback( () => {
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
                alert.pushAlert( "Undo: Changing component", "info")
                dispatchEntities({
                    type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                        entityID: changes[c].entityID,
                        data: changes[c].component,
                        key: changes[c].componentKey
                    }
                })
                break
            case HISTORY_ACTIONS.PUSHING_DATA:
                alert.pushAlert("Redo: Adding entities (" + changes[c].entities.length+ ")", "info")
                dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: changes[c].entities})
                break
            case HISTORY_ACTIONS.DELETING_ENTITIES:
                alert.pushAlert("Redo: Deleting entities (" + changes[c].entities.length+ ")", "info")
                dispatchEntities({
                    type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: changes[c].entities.flat().map(e => e.id)
                })
                break
            default:
                break
            }
        }
    }, [entities, currentChange, changes])
    const returnChanges = useCallback( () => {
        let c = currentChange - 1
        if (currentChange === undefined) {
            setCurrentChange(changes.length)
            c = changes.length - 1
        } else if (currentChange > 0)
            setCurrentChange(prev => prev - 1)
        if (c >= 0) {
            switch (changes[c].type) {
            case HISTORY_ACTIONS.SAVE_COMPONENT_STATE:
                alert.pushAlert("Redo: Changing component", "info")
                dispatchEntities({
                    type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                        entityID: changes[c].entityID,
                        data: changes[c].component,
                        key: changes[c].componentKey
                    }
                })
                break
            case HISTORY_ACTIONS.PUSHING_DATA:
                alert.pushAlert( "Undo: Adding entities (" + changes[c].entities.length+ ")", "info")
                dispatchEntities({type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: changes[c].entities.map(e => e.id)})
                break
            case HISTORY_ACTIONS.DELETING_ENTITIES:
                alert.pushAlert("Undo: Deleting entities (" + changes[c].entities.length+ ")", "info")
                dispatchEntities({
                    type: ENTITY_ACTIONS.PUSH_BLOCK, payload: changes[c].entities.flat()
                })
                break
            default:
                break
            }
        }
    }, [entities, currentChange, changes])
    return {
        forwardChanges,
        returnChanges,
        changes,
        dispatchChanges
    }
}