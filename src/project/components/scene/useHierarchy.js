import React, {useEffect, useState} from "react"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import {ENTITY_ACTIONS} from "../../engine-extension/entityReducer"

const getHierarchy = (start, all) => {
    const result = []
    const direct = all.filter(e => e.linkedTo === start.id)
    direct.forEach(d => {
        result.push(...getHierarchy(d, all))
    })
    result.push(...direct)
    return result
}


export default function useHierarchy(engine, required,  worker) {
    const [allHidden, setAllHidden] = useState(false)
    const [hierarchy, setHierarchy] = useState([])
    const setSelected = (el, e) => {
        if (e && e.ctrlKey) {
            engine.setSelected(prev => {
                const indexFound = prev.findIndex(f => f === el.id)
                if (indexFound === -1) return [...prev, el.id]
                else {
                    let n = [...prev]
                    n.splice(indexFound, 1)
                    return n
                }
            })

        } else if (!el.components[COMPONENTS.FOLDER])
            engine.setSelected([el.id])
        else if (el.components[COMPONENTS.FOLDER]) {
            engine.setSelected(getHierarchy(el, engine.entities).filter(e => !e.components[COMPONENTS.FOLDER]).map(e => e.id))
        }
    }
    const mapChildren = (node) => {
        node.onClick = (e) => setSelected(node.entity, e)
        node.onHide = () => {
            if (node.hidden && setAllHidden)
                setAllHidden(false)
            engine.dispatchEntities({
                type: ENTITY_ACTIONS.UPDATE,
                payload: {
                    entityID: node.id,
                    data: node.hidden,
                    key: "active"
                }
            })
            node.children.forEach(c => {
                engine.dispatchEntities({
                    type: ENTITY_ACTIONS.UPDATE,
                    payload: {
                        entityID: c.id,
                        data: c.hidden,
                        key: "active"
                    }
                })
            })
        }
        node.icon = <span className={"material-icons-round"} style={{fontSize: "1rem"}}>{node.icon}</span>
        if (node.children.length > 0)
            node.children = node.children.map(n => mapChildren(n))
        return node
    }
    useEffect(() => {
        worker.postMessage({entities: engine.entities.map(e => {
            return {...e, components: Object.keys(e.components)}
        }), required: required, COMPONENTS})
        worker.onmessage = ({data: toFilter}) => {
            setHierarchy([
                {
                    id: 0,
                    label: "Scene",
                    children: toFilter.map(e => mapChildren(e)),
                    icon: <span className={"material-icons-round"} style={{fontSize: "1rem"}}>inventory_2</span>,
                    type: "Scene",
                    phantomNode: true,
                    onHide: () => {
                        let newEntities
                        if (allHidden) {
                            setAllHidden(false)
                            newEntities = engine.entities.map(e => {
                                e.active = true
                                return e
                            })
                        } else {
                            setAllHidden(true)
                            newEntities = engine.entities.map(e => {
                                e.active = false
                                return e
                            })
                        }
                        engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: newEntities})
                    },
                    canBeHidden: true,
                    hidden: allHidden
                }
            ])
        }
    }, [engine.entities, allHidden, required])

    return hierarchy
}