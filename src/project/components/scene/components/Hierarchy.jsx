import React, {useMemo, useState} from "react"
import PropTypes from "prop-types"
import styles from "../styles/Scene.module.css"
import {Button, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core"
import TreeView from "../../../../components/tree/TreeView"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import {ENTITY_ACTIONS} from "../../../engine-extension/entityReducer"
import useHierarchy from "../hooks/useHierarchy"
import getComponentInfo from "../utils/getComponentInfo"

import {createFolder, getHierarchy} from "../utils/hiearchyUtils"

const TRIGGERS = ["data-node", "data-self"]
const WORKER = new Worker(new URL("../hooks/hierarchy.js", import.meta.url))
export default function Hierarchy(props){
    const [required, setRequired] = useState()
    const data = useHierarchy(props.engine, required,  WORKER)
    const options = useMemo(() => {
        return Object.keys(COMPONENTS).map(e => {
            const o = getComponentInfo(COMPONENTS[e])
            if (Object.keys(o).length > 0)
                return (
                    <React.Fragment key={e}>
                        <DropdownOption option={{
                            onClick: () => setRequired(required === COMPONENTS[e] ? undefined : COMPONENTS[e]),
                            ...o,
                            icon: required !== COMPONENTS[e] ? undefined :
                                <span className={"material-icons-round"} style={{fontSize: "1rem"}}>checked</span>
                        }}/>
                    </React.Fragment>
                )
        })
    }, [required])

    const treeOptions = useMemo(() => {
        return [
            {
                requiredTrigger: "data-self",
                label: "Create folder",
                icon: "create_new_folder",
                onClick: () => createFolder(props.engine)
            },

            {
                requiredTrigger: "data-node",
                label: "Copy",
                onClick: (target) => props.operationUtils.copy(false,  target.getAttribute("data-node"))
            },
            {
                requiredTrigger: "data-node",
                label: "Paste on hierarchy",
                onClick: (target) => props.operationUtils.paste( target.getAttribute("data-node"))
            },
            {
                requiredTrigger: "data-node",
                label: "Duplicate",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const entity = props.engine.entities.find(e => e.id === t)
                    if(entity)
                        props.engine.dispatchEntities({
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
                    const toRemove = getHierarchy(props.engine.entities.find(e => e.id === t), props.engine.entities).map(e => e.id)

                    props.engine.setSelected([])
                    props.engine.dispatchEntities({
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
                    props.engine.setSelected(prev => prev.filter(s => s !== t))
                }
            },
            {
                requiredTrigger: "data-node",
                label: "Deselect hierarchy",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const toDeselect = [t, ...getHierarchy(props.engine.entities.find(e => e.id === t), props.engine.entities).map(e => e.id)]
                    props.engine.setSelected(prev => prev.filter(s => toDeselect.includes(s)))
                }
            },
            {divider: true},
            {
                requiredTrigger: "data-node",
                label: "Select",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    props.engine.setSelected(prev => [...prev, t])
                }
            },
            {
                requiredTrigger: "data-node",
                label: "Select hierarchy",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const toSelect = [t, ...getHierarchy(props.engine.entities.find(e => e.id === t), props.engine.entities).map(e => e.id)]
                    props.engine.setSelected(prev => [...prev, ...toSelect])
                }
            },
            {
                requiredTrigger: "data-node",
                label: "Focus",
                icon: "place",
                onClick: (target) => {
                    const t = target.getAttribute("data-node")
                    const entity = props.engine.entities.find(e => e.id === t)
                    const comp = entity ? entity.components[COMPONENTS.TRANSFORM] : undefined
                    if (entity && comp) {
                        const t = comp.translation

                        props.engine.renderer.camera.radius = 10
                        props.engine.renderer.camera.centerOn = t

                        props.engine.renderer.camera.updateViewMatrix()
                    }
                }
            },
        ]
    }, [props.engine.entities])


    return (
        <div className={styles.wrapperContent} style={{overflow: "hidden",   background: "var(--pj-background-secondary)"}}>
            <div
                className={styles.header}
                style={{justifyContent: "space-between", padding: "0 4px"}}
            >
                <label className={styles.overflow}>
					Scene hierarchy
                </label>
                <div style={{display: "flex", gap: "2px"}}>
                    <Button className={styles.button} onClick={() => createFolder()}>
                        <span
                            className={"material-icons-round"}
                            style={{fontSize: "1rem"}}>create_new_folder</span>
                    </Button>
                    <Dropdown className={styles.button} hideArrow={true}>
                        <span
                            className={"material-icons-round"}
                            style={{fontSize: "1rem"}}
                        >filter_alt</span>
                        <DropdownOptions>
                            {options}
                        </DropdownOptions>
                    </Dropdown>
                </div>
            </div>
            <TreeView
                contextTriggers={TRIGGERS}
                onMultiSelect={(items) => props.engine.setSelected(items)}
                multiSelect={true}
                searchable={true}
                draggable={true}
                options={treeOptions}
                onDrop={(event, target) => {
                    event.preventDefault()
                    try {
                        const entities = JSON.parse(event.dataTransfer.getData("text"))
                        entities.forEach(entity => {
                            const current = props.engine.entities.find(f => f.id === target)
                            const dropTarget = props.engine.entities.find(f => f.id === entity)

                            if (!current && dropTarget) {
                                if(dropTarget.components[COMPONENTS.TRANSFORM])
                                    dropTarget.components[COMPONENTS.TRANSFORM].changed = true
                                props.engine.dispatchEntities({
                                    type: ENTITY_ACTIONS.UPDATE,
                                    payload: {
                                        entityID: dropTarget.id, key: "linkedTo", data: undefined
                                    }
                                })
                            } else if (dropTarget && dropTarget !== current && current.linkedTo !== dropTarget.id) {
                                if(dropTarget.components[COMPONENTS.TRANSFORM])
                                    dropTarget.components[COMPONENTS.TRANSFORM].changed = true

                                props.engine.dispatchEntities({
                                    type: ENTITY_ACTIONS.UPDATE,
                                    payload: {
                                        entityID: dropTarget.id,
                                        key: "linkedTo",
                                        data: current.id
                                    }
                                })
                            }
                        })
                    } catch (e) {
                        console.error(e)
                    }
                }}
                onDragStart={e => {
                    if (e.ctrlKey)
                        e.dataTransfer.setData("text", JSON.stringify(props.engine.selected.includes(e.currentTarget.id) ? props.engine.selected : [...props.engine.selected, e.currentTarget.id]))
                    else e.dataTransfer.setData("text", JSON.stringify([e.currentTarget.id]))
                }}

                ids={props.engine.entities}
                selected={props.engine.selected}
                nodes={data}
                handleRename={(treeNode, newName) => {
                    props.engine.dispatchEntities({
                        type: ENTITY_ACTIONS.UPDATE, payload: {entityID: treeNode.id, key: "name", data: newName}
                    })
                }}
            />
        </div>
    )
}

Hierarchy.propTypes={
    executingAnimation: PropTypes.bool,
    setAlert: PropTypes.func.isRequired,
    engine: PropTypes.object,
    operationUtils: PropTypes.object
}