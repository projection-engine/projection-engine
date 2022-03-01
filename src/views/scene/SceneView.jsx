import PropTypes from "prop-types";
import styles from './styles/Scene.module.css'
import React, {useContext, useMemo, useState} from "react";

import TreeView from "../../components/tree/TreeView";
import mapToView from "./utils/mapToView";
import useForm from "./utils/useForm";
import QuickAccessProvider from "../../services/hooks/QuickAccessProvider";

import {LoaderProvider} from "@f-ui/core";
import FolderComponent from "../../services/engine/ecs/components/FolderComponent";
import {ENTITY_ACTIONS} from "../../services/utils/entityReducer";
import Entity from "../../services/engine/ecs/basic/Entity";
import ResizableBar from "../../components/resizable/ResizableBar";

export default function SceneView(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const [searchString, setSearchString] = useState('')
    const [allHidden, setAllHidden] = useState(false)

    const load = useContext(LoaderProvider)
    const data = useMemo(() => {
        let toFilter = props.engine.entities.filter(d => !d.linkedTo && !d.components.Grid && (searchString.length > 0 ? d.name.toLowerCase().includes(searchString) : true))
        return [{
            id: 0,
            label: 'Scene',
            children: toFilter.map(f => {
                return mapToView(f, props.engine.entities, (el, e) => {
                    if (e && e.ctrlKey) {
                        props.engine.setSelected(prev => {
                            const indexFound = prev.findIndex(f => f === el)
                            if (indexFound === -1)
                                return [...prev, el]
                            else {
                                let n = [...prev]
                                n.splice(indexFound, 1)
                                return n
                            }
                        })
                    } else
                        props.engine.setSelected([el])
                }, props.engine, setAllHidden)
            }),
            icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>inventory_2</span>,
            type: 'Scene',
            phantomNode: true,
            onHide: () => {
                let newEntities
                if (allHidden) {
                    setAllHidden(false)
                    newEntities = props.engine.entities.map(e => {
                        e.active = true
                        return e
                    })
                } else {

                    setAllHidden(true)
                    newEntities = props.engine.entities.map(e => {
                        e.active = false
                        return e
                    })

                }

                props.engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: newEntities})
            },
            canBeHidden: true,
            hidden: allHidden
        }]
    }, [props.engine.entities, searchString])


    const currentForm = useForm(
        props.engine,
        props.engine.selected,
        props.setAlert,
        props.executingAnimation,

        quickAccess,
        load
    )

    return (
        <div className={styles.wrapper}>

            <div className={styles.wrapperContent} style={{overflow: 'hidden'}}>
                <TreeView
                    contextTriggers={[
                        'data-node',
                        'data-self'
                    ]}
                    onMultiSelect={(items) => props.engine.setSelected(items)}
                    multiSelect={true}
                    searchable={true}
                    draggable={true}
                    options={[
                        {
                            requiredTrigger: 'data-self',
                            label: 'Create folder',
                            icon: <span className={'material-icons-round'}>create_new_folder</span>,
                            onClick: () => {
                                const newEntity = new Entity()
                                newEntity.name = 'New folder'
                                props.engine.dispatchEntities({
                                    type: ENTITY_ACTIONS.ADD,
                                    payload: newEntity
                                })
                                props.engine.dispatchEntities({
                                    type: ENTITY_ACTIONS.ADD_COMPONENT,
                                    payload: {
                                        entityID: newEntity.id,
                                        data: new FolderComponent()
                                    }
                                })
                            }
                        },

                        {
                            requiredTrigger: 'data-node',
                            label: 'Remove entity',
                            icon: <span className={'material-icons-round'}>delete</span>,
                            onClick: (node) => {
                                props.engine.setSelected([])
                                props.engine.dispatchEntities({
                                    type: ENTITY_ACTIONS.REMOVE,
                                    payload: {
                                        entityID: node.getAttribute('data-node')
                                    }
                                })
                            }
                        }
                    ]}
                    onDrop={(event, target) => {
                        event.preventDefault()
                        try {
                            const entities = JSON.parse(event.dataTransfer.getData('text'))
                            entities.forEach(entity => {
                                const current = props.engine.entities.find(f => f.id === target)
                                const dropTarget = props.engine.entities.find(f => f.id === entity)

                                if (!current) {
                                    props.engine.dispatchEntities({
                                        type: ENTITY_ACTIONS.UPDATE,
                                        payload: {
                                            entityID: dropTarget.id,
                                            key: 'linkedTo',
                                            data: undefined
                                        }
                                    })
                                } else if (dropTarget && dropTarget !== current && current.linkedTo !== dropTarget.id) {
                                    props.engine.dispatchEntities({
                                        type: ENTITY_ACTIONS.UPDATE,
                                        payload: {
                                            entityID: dropTarget.id,
                                            key: 'linkedTo',
                                            data: current.id
                                        }
                                    })
                                }
                            })
                        } catch (e) {
                        }
                    }}
                    onDragStart={e => {
                        if (e.ctrlKey)
                            e.dataTransfer.setData('text', JSON.stringify(props.engine.selected.includes(e.currentTarget.id) ? props.engine.selected : [...props.engine.selected, e.currentTarget.id]))
                        else
                            e.dataTransfer.setData('text', JSON.stringify([e.currentTarget.id]))
                    }}

                    ids={props.engine.entities}
                    selected={props.engine.selected}
                    nodes={data}
                    handleRename={(treeNode, newName) => props.engine.dispatchEntities({
                        type: ENTITY_ACTIONS.UPDATE,
                        payload: {entityID: treeNode.id, key: 'name', data: newName}
                    })}
                />
            </div>
            <ResizableBar type={'height'}/>
            <div className={styles.wrapperContent}>
                {currentForm}
            </div>
        </div>
    )
}

SceneView.propTypes = {
    executingAnimation: PropTypes.bool,
    setAlert: PropTypes.func.isRequired,
    engine: PropTypes.object,
}