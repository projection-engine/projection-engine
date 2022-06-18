import React, {useEffect, useMemo, useState} from "react"
import COMPONENTS from "../engine/templates/COMPONENTS"
import {ENTITY_ACTIONS} from "../engine-extension/entityReducer"
import {Icon} from "@f-ui/core"
import {createFolder} from "../components/hierarchy/utils/hiearchyUtils"

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
    renderer,
    dispatchChanges,
    worker,
    searchedEntity,
    operationUtils
) {
    const [allHidden, setAllHidden] = useState(false)
    const [hierarchy, setHierarchy] = useState([])
    const setSelected = (el, e) => {
        if (e && e.ctrlKey) {
            setSelectedEntity(prev => {
                const indexFound = prev.findIndex(f => f === el.id)
                if (indexFound === -1) return [...prev, el.id]
                else {
                    let n = [...prev]
                    n.splice(indexFound, 1)
                    return n
                }
            })

        } else if (!el.components[COMPONENTS.FOLDER])
            setSelectedEntity([el.id])
        else if (el.components[COMPONENTS.FOLDER]) {
            setSelectedEntity(getHierarchy(el, entities).filter(e => !e.components[COMPONENTS.FOLDER]).map(e => e.id))
        }
    }
    const mapChildren = (node) => {
        node.onClick = (e) => setSelected(node.entity, e)
        node.onHide = () => {
            if (node.hidden && setAllHidden)
                setAllHidden(false)
            dispatchEntities({
                type: ENTITY_ACTIONS.UPDATE,
                payload: {
                    entityID: node.id,
                    data: node.hidden,
                    key: "active"
                }
            })
            node.children.forEach(c => {
                dispatchEntities({
                    type: ENTITY_ACTIONS.UPDATE,
                    payload: {
                        entityID: c.id,
                        data: c.hidden,
                        key: "active"
                    }
                })
            })
        }
        node.icon = <Icon  styles={{fontSize: "1rem"}}>{node.icon}</Icon>
        if (node.children.length > 0)
            node.children = node.children.map(n => mapChildren(n))
        return node
    }
    useEffect(() => {
        worker.postMessage({entities: entities.map(e => {
            return {...e, components: Object.keys(e.components)}
        }), COMPONENTS, searchedEntity})
        worker.onmessage = ({data: toFilter}) => {
            setHierarchy([
                {
                    id: 0,
                    label: "Scene",
                    children: toFilter.map(e => mapChildren(e)),
                    icon: <Icon styles={{fontSize: "1rem"}}>inventory_2</Icon>,
                    type: "Scene",
                    draggable: false,
                    disabled: true,
                    onHide: () => {
                        let newEntities
                        if (allHidden) {
                            setAllHidden(false)
                            newEntities = entities.map(e => {
                                e.active = true
                                return e
                            })
                        } else {
                            setAllHidden(true)
                            newEntities = entities.map(e => {
                                e.active = false
                                return e
                            })
                        }
                        dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: newEntities})
                    },
                    canBeHidden: true,
                    hidden: allHidden
                }
            ])
        }
    }, [entities, allHidden, searchedEntity])


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

                        renderer.camera.radius = 10
                        renderer.camera.centerOn = t

                        renderer.camera.updateViewMatrix()
                    }
                }
            },
        ]
    }, [entities])


    return [hierarchy, treeOptions]
}