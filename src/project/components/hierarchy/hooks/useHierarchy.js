import React, {useEffect, useMemo, useRef, useState} from "react"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import {ENTITY_ACTIONS} from "../../../engine-extension/entityReducer"
import {Icon} from "@f-ui/core"
import {createFolder} from "../utils/hiearchyUtils"

const getHierarchy = (start, all) => {
    const result = []
    const direct = all.filter(e => e.linkedTo === start.id)
    direct.forEach(d => {
        result.push(...getHierarchy(d, all))
    })
    result.push(...direct)
    return result
}


export default function useHierarchy(
    setSelectedEntity,
    dispatchEntities,
    entities,
    selected,
    dispatchChanges,
    worker,
    searchedEntity,
    operationUtils
) {
    const [allHidden, setAllHidden] = useState(false)
    const [hierarchy, setHierarchy] = useState([])
    const lastLength = useRef(entities.length)
    const wasHidden = useRef(false)
    const setSelected = (entity, event) => {
        if (event.ctrlKey) {
            setSelectedEntity(prev => {
                const indexFound = prev.findIndex(f => f === entity.id)
                if (indexFound === -1) return [...prev, entity.id]
                else {
                    let n = [...prev]
                    n.splice(indexFound, 1)
                    return n
                }
            })
        } else if (!entity.components[COMPONENTS.FOLDER])
            setSelectedEntity([entity.id])
        else if (entity.components[COMPONENTS.FOLDER])
            setSelectedEntity(getHierarchy(entity, entities).filter(e => !e.components[COMPONENTS.FOLDER]).map(e => e.id))

    }



    function updateHierarchy(){
        // worker.postMessage({entities, COMPONENTS, searchedEntity})
        // worker.onmessage = ({data: toFilter}) => {
        //     setHierarchy([
        //         {
        //             id: 0,
        //             label: "Scene",
        //             children: toFilter,
        //             icon:"inventory_2",
        //             type: "Scene",
        //             draggable: false,
        //             disabled: true,
        //             onHide: () => {
        //                 let newEntities
        //                 if (allHidden) {
        //                     setAllHidden(false)
        //                     newEntities = entities.map(e => {
        //                         e.active = true
        //                         return e
        //                     })
        //                 } else {
        //                     setAllHidden(true)
        //                     newEntities = entities.map(e => {
        //                         e.active = false
        //                         return e
        //                     })
        //                 }
        //                 dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: newEntities})
        //             },
        //             canBeHidden: true,
        //             hidden: allHidden
        //         }
        //     ])
        // }
    }



    useEffect(() => {
        const currentLength = entities.length
        if(currentLength !== lastLength.current || wasHidden.current){
            wasHidden.current = false
            lastLength.current = currentLength
            updateHierarchy()
        }
    }, [entities])
    useEffect(() => {
        updateHierarchy()
    }, [allHidden, searchedEntity])


    const treeOptions = useMemo(() => {
        return [
            {
                requiredTrigger: "data-self",
                label: "Create folder",
                icon: "create_new_folder",
                onClick: () => createFolder(dispatchEntities, dispatchChanges)
            },

            {
                requiredTrigger: "data-node",
                label: "Copy",
                onClick: (target) => operationUtils.copy(false,  target.getAttribute("data-node"))
            },
            {
                requiredTrigger: "data-node",
                label: "Paste on hierarchy",
                onClick: (target) => operationUtils.paste( target.getAttribute("data-node"))
            },
            {
                requiredTrigger: "data-node",
                label: "Duplicate",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const entity = entities.find(e => e.id === t)
                    if(entity)
                        dispatchEntities({
                            type: ENTITY_ACTIONS.ADD,
                            payload: entity.clone()
                        })
                }
            },
            {
                requiredTrigger: "data-node",
                label: "Remove entity",
                icon: "delete",
                onClick: (node) => {
                    const t = node.getAttribute("data-node")
                    const toRemove = getHierarchy(entities.find(e => e.id === t), entities).map(e => e.id)

                    setSelectedEntity([])
                    dispatchEntities({
                        type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: [...toRemove, t]
                    })

                }
            },

            {divider: true},
            {
                requiredTrigger: "data-node",
                label: "Deselect",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    setSelectedEntity(prev => prev.filter(s => s !== t))
                }
            },
            {
                requiredTrigger: "data-node",
                label: "Deselect hierarchy",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const toDeselect = [t, ...getHierarchy(entities.find(e => e.id === t), entities).map(e => e.id)]
                    setSelectedEntity(prev => prev.filter(s => toDeselect.includes(s)))
                }
            },
            {divider: true},
            {
                requiredTrigger: "data-node",
                label: "Select",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    setSelectedEntity(prev => [...prev, t])
                }
            },
            {
                requiredTrigger: "data-node",
                label: "Select hierarchy",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const toSelect = [t, ...getHierarchy(entities.find(e => e.id === t), entities).map(e => e.id)]
                    setSelectedEntity(prev => [...prev, ...toSelect])
                }
            },
            {
                requiredTrigger: "data-node",
                label: "Focus",
                icon: "place",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const entity = entities.find(e => e.id === t)
                    const comp = entity ? entity.components[COMPONENTS.TRANSFORM] : undefined
                    if (entity && comp) {
                        const t = comp.translation

                        window.renderer.camera.radius = 10
                        window.renderer.camera.centerOn = t

                        window.renderer.camera.updateViewMatrix()
                    }
                }
            },
        ]
    }, [entities])


    return [hierarchy, treeOptions, setSelected, setAllHidden]
}