import PropTypes from "prop-types";
import styles from './styles/Scene.module.css'
import React, {useContext, useMemo, useState} from "react";

import TreeView from "../../components/tree/TreeView";
import mapToView from "./utils/mapToView";
import useForm from "./utils/useForm";
import QuickAccessProvider from "../../services/hooks/QuickAccessProvider";

import {Button, LoaderProvider} from "@f-ui/core";
import FolderComponent from "../../services/engine/ecs/components/FolderComponent";
import {ENTITY_ACTIONS} from "../../services/utils/entityReducer";
import Entity from "../../services/engine/ecs/basic/Entity";
import ResizableBar from "../../components/resizable/ResizableBar";
import FormTabs from "./forms/FormTabs";
import COMPONENTS from "../../services/engine/templates/COMPONENTS";
import ScriptComponent from "../../services/engine/ecs/components/ScriptComponent";
import getElementIcon from "./utils/getElementIcon";
import getElementType from "./utils/getElementType";
import {HISTORY_ACTIONS} from "../../services/utils/historyReducer";

export default function SceneView(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const [currentTab, setCurrentTab] = useState(0)
    const [allHidden, setAllHidden] = useState(false)
    const [hidden, setHidden] = useState(false)
    const load = useContext(LoaderProvider)

    const data = useMemo(() => {
        let toFilter = props.engine.entities.filter(d => !d.linkedTo)
    console.log(props.engine.entities)
        return [{
            id: 0,
            label: 'Scene',
            children:
                toFilter.map(f => {
                    return mapToView(
                        f,
                        props.engine.entities,
                        (el, e) => {
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
                        },
                        props.engine,
                        setAllHidden, false)
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
    }, [props.engine.entities])


    const currentForm = useForm(
        props.engine,

        props.setAlert,
        props.executingAnimation,

        quickAccess,
        load,
        currentTab
    )


    const createFolder = () => {
        const newEntity = new Entity()
        newEntity.name = 'New folder'
        newEntity.components[COMPONENTS.FOLDER] = new FolderComponent()
        props.engine.dispatchEntities({
            type: ENTITY_ACTIONS.ADD,
            payload: newEntity
        })
        props.engine.dispatchChanges({
            type: HISTORY_ACTIONS.PUSHING_DATA,
            payload: [newEntity]
        })
    }
    return (
        <div className={styles.wrapper} style={{width: hidden ? '35px' : undefined}}>

            <div className={styles.wrapperContent} style={{overflow: 'hidden', height: hidden ? '100%' : undefined}}>
                <div className={[styles.header, styles.mainHeader].join(' ')} data-hidden={`${hidden}`}
                     style={{justifyContent: 'flex-start', padding: '0 4px'}}>
                    <Button className={styles.button} onClick={() => setHidden(!hidden)} variant={'outlined'}>
                        <span className={'material-icons-round'}
                              style={{fontSize: '1rem'}}>{!hidden ? 'menu_open' : 'menu'}</span>
                    </Button>
                    <label>
                        Scene hierarchy
                    </label>
                    {hidden ? null :

                        <Button className={styles.button} onClick={() => createFolder()}
                                styles={{position: 'absolute', right: '4px'}}>
                        <span className={'material-icons-round'}
                              style={{fontSize: '1rem'}}>create_new_folder</span>
                        </Button>
                    }
                </div>
                {hidden ? null :
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
                                onClick: () => createFolder()
                            },

                            {
                                requiredTrigger: 'data-node',
                                label: 'Remove entity',
                                icon: <span className={'material-icons-round'}>delete</span>,
                                onClick: (node) => {
                                    const toDelete = [node.getAttribute('data-node')]
                                    const e = props.engine.scripts.find(s => s.id === toDelete[0])

                                    if (e)
                                        props.engine.setScripts(prev => {
                                            return prev.filter(p => p.id !== e.id)
                                        })
                                    props.engine.setSelected([])
                                    props.engine.dispatchEntities({
                                        type: ENTITY_ACTIONS.REMOVE_BLOCK,
                                        payload: toDelete
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
                        handleRename={(treeNode, newName) => {
                            props.engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE,
                                payload: {entityID: treeNode.id, key: 'name', data: newName}
                            })
                        }}
                    />
                }
            </div>
            {hidden ? null :
                <>
                    <ResizableBar type={'height'}/>
                    <div className={styles.wrapperContent}>
                        {currentForm.open ? (
                            <div className={styles.header}>
                                <label>{currentForm.name}</label>
                                <Button
                                    styles={{height: '20px', width: '20px'}}
                                    onClick={() => props.engine.setLockedEntity(props.engine.lockedEntity === currentForm.selected?.id ? undefined : currentForm.selected.id)}
                                    className={styles.button}
                                    highlight={props.engine.lockedEntity === currentForm.selected?.id}
                                    variant={"outlined"}>
                                    <span className={'material-icons-round'} style={{fontSize: '1rem'}}>push_pin</span>
                                </Button>
                            </div>
                        ) : null}

                        <div className={styles.content}>
                            {currentForm.open ?
                                <FormTabs
                                    addComponent={() => {
                                        currentForm.selected.components[COMPONENTS.SCRIPT] = new ScriptComponent()
                                        props.engine.dispatchEntities({
                                            type: ENTITY_ACTIONS.ADD_COMPONENT,
                                            payload: {
                                                entityID: props.engine.selected[0],
                                                data: currentForm.selected.components[COMPONENTS.SCRIPT],
                                                key: COMPONENTS.SCRIPT
                                            }
                                        })
                                    }}
                                    entity={currentForm.selected}
                                    currentTab={currentTab}
                                    setCurrentTab={setCurrentTab}
                                />
                                :
                                null
                            }
                            {currentForm.content}
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

SceneView.propTypes = {
    executingAnimation: PropTypes.bool,
    setAlert: PropTypes.func.isRequired,
    engine: PropTypes.object,
}