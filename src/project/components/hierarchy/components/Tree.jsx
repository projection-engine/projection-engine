import React, {useContext, useEffect, useId, useMemo, useState} from "react"
import styles from "../styles/Tree.module.css"
import Branch from "./Branch"
import useInfiniteScroll from "../useInfiniteScroll"
import {v4} from "uuid"
import ENTITY_WORKER_ACTIONS from "../../../../static/misc/ENTITY_WORKER_ACTIONS"
import {ENTITY_ACTIONS} from "../../../engine-extension/entityReducer"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import useContextTarget from "../../../../components/context/hooks/useContextTarget"
import Entity from "../../../engine/basic/Entity"
import FolderComponent from "../../../engine/components/FolderComponent"
import HierarchyProvider from "../../../context/HierarchyProvider"


function createFolder(dispatchEntities) {
    const newEntity = new Entity()
    newEntity.name = "New folder"
    newEntity.components[COMPONENTS.FOLDER] = new FolderComponent()
    dispatchEntities({
        type: ENTITY_ACTIONS.ADD, payload: newEntity
    })
}

const getHierarchy = (start) => {
    const result = []
    const direct = start.children
    direct.forEach(d => {
        result.push(...getHierarchy(d))
    })
    result.push(...direct)
    return result
}


const localActionID = v4(), TRIGGERS = ["data-node"]
export const TreeProvider = React.createContext([0, [], new Map()])
export default function Tree( ) {
    const ID = useId()
    const {
        setSelected,
        dispatchEntities,
        entitiesChangeID,
        operationUtils,
        lockedEntity,
        setLockedEntity,
        selected
    } = useContext(HierarchyProvider)
    const [open, setOpen] = useState({})
    const [toRender, setToRender] = useState([])
    const [ref, offset, maxDepth] = useInfiniteScroll()

    const options = useMemo(() => {
        return [
            {
                requiredTrigger: "data-self",
                label: "Create folder",
                icon: "create_new_folder",
                onClick: () => createFolder(dispatchEntities)
            },

            {
                requiredTrigger: "data-node",
                label: "Copy",
                onClick: (target) => operationUtils.copy(false, target.getAttribute("data-node"))
            },
            {
                requiredTrigger: "data-node",
                label: "Paste on hierarchy",
                onClick: (target) => operationUtils.paste(target.getAttribute("data-node"))
            },
            {
                requiredTrigger: "data-node",
                label: "Duplicate",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const entity = window.renderer.entitiesMap.get(t)
                    if (entity)
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
                    const toRemove = getHierarchy(window.renderer.entitiesMap.get(t)).map(e => e.id)
                    setSelected([])
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
                    setSelected(prev => prev.filter(s => s !== t))
                }
            },
            {
                requiredTrigger: "data-node",
                label: "Deselect hierarchy",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const toDeselect = [t, ...getHierarchy(window.renderer.entitiesMap.get(t)).map(e => e.id)]
                    setSelected(prev => prev.filter(s => toDeselect.includes(s)))
                }
            },
            {divider: true},
            {
                requiredTrigger: "data-node",
                label: "Select",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    setSelected(prev => [...prev, t])
                }
            },
            {
                requiredTrigger: "data-node",
                label: "Select hierarchy",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const toSelect = [t, ...getHierarchy(window.renderer.entitiesMap.get(t)).map(e => e.id)]
                    setSelected(prev => [...prev, ...toSelect])
                }
            },
            {
                requiredTrigger: "data-node",
                label: "Focus",
                icon: "place",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const entity = window.renderer.entitiesMap.get(t)
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

    }, [selected])

    useContextTarget(
        "tree-view-" + ID,
        options,
        TRIGGERS
    )

    useEffect(() => {
        window.entityWorker.postMessage({
            type: ENTITY_WORKER_ACTIONS.GET_HIERARCHY,
            actionID: localActionID
        })
        window.addEntityWorkerListener(
            payload => {
                const data = []
                for (let i = 0; i < payload.length; i++) {
                    if (!payload[i].parent || open[payload[i].parent.id])
                        data.push(payload[i].parent)
                }
                setToRender(payload)
            },
            localActionID
        )
    }, [entitiesChangeID, maxDepth, open])

    return (
        <div
            ref={ref}
            data-self={"self"}
            data-offset={offset}
            className={styles.wrapper}
            id={"tree-view-" + ID}
        >
            <TreeProvider.Provider value={[offset, open, setOpen]}>
                {toRender.map((e, i) => i < maxDepth ? (
                    <React.Fragment key={i + "-branch-" + ID}>
                        <Branch
                            {...toRender[i + offset]}
                            selected={selected}
                            setSelected={(entity, ctrlKey) => {
                                if (ctrlKey) {
                                    if (!selected.includes(entity))
                                        setSelected([...selected, entity])
                                    else
                                        setSelected(selected.filter(e => e !== entity))
                                } else
                                    setSelected([entity])
                            }}
                            lockedEntity={lockedEntity}
                            setLockedEntity={setLockedEntity}
                            internalID={ID}
                            open={open}
                            setOpen={setOpen}

                        />
                    </React.Fragment>
                ) : null)}
            </TreeProvider.Provider>
        </div>
    )
}
 