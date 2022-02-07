import PropTypes from "prop-types";
import styles from './styles/Scene.module.css'
import React, {useContext, useMemo, useState} from "react";

import TreeView from "../../components/tree/TreeView";
import mapToView from "./utils/mapToView";
import useForm from "./utils/useForm";
import QuickAccessProvider from "../../components/db/QuickAccessProvider";
import DatabaseProvider from "../../components/db/DatabaseProvider";
import ContextMenu from "../../components/context/ContextMenu";
import FolderComponent from "../../services/engine/ecs/components/FolderComponent";
import {ENTITY_ACTIONS} from "../../services/engine/ecs/utils/entityReducer";
import Entity from "../../services/engine/ecs/basic/Entity";
import {Button} from "@f-ui/core";
import Search from "../../components/search/Search";
import ResizableBar from "../../components/resizable/ResizableBar";

export default function SceneView(props) {
    const database = useContext(DatabaseProvider)
    const quickAccess = useContext(QuickAccessProvider)

    const [searchString, setSearchString] = useState('')

    const data = useMemo(() => {
        let toFilter = props.engine.entities.filter(d => !d.linkedTo && !d.components.GridComponent && (searchString.length > 0 ?  d.name.toLowerCase().includes(searchString) : true))
        return [{
            id: 0,
            label: 'Scene',
            children: toFilter.map(f => {
                return mapToView(f, props.engine.entities, (el) => {
                    props.engine.setSelectedElement(el)
                })
            }),
            icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>inventory_2</span>,
            type: 'Scene',
            phantomNode: true
        }]
    }, [props.engine.entities, searchString])

    const currentForm = useForm(
        props.engine,
        props.engine.selectedElement,
        props.setAlert,
        props.executingAnimation,

        quickAccess,
        database
    )

    return (
        <div className={styles.wrapper}>
            <ContextMenu
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
                            database.deleteEntity(node.getAttribute('data-node'))
                                .then(() => {
                                    props.engine.dispatchEntities({
                                        type: ENTITY_ACTIONS.REMOVE,
                                        payload: {entityID: node.getAttribute('data-node')}
                                    })
                                })

                        }
                    }
                ]}

                triggers={['data-self', 'data-node']}
                className={[styles.wrapperContent, styles.backgroundStripes].join(' ')}>
                <div style={{display: 'flex', width: '100%'}}>
                    <Search width={'100%'} searchString={searchString} setSearchString={setSearchString}/>
                    <Button onClick={() => quickAccess.refresh()} className={styles.refreshButton}>
                        <span style={{fontSize: '1rem'}} className={'material-icons-round'}>refresh</span>
                    </Button>
                </div>
                <TreeView
                    draggable={true}
                    onDrop={(event, target) => {
                        event.preventDefault()

                        const current = props.engine.entities.find(f => f.id === target)
                        const dropTarget = props.engine.entities.find(f => f.id === event.dataTransfer.getData('text'))

                        if(!current){
                            props.engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE,
                                payload: {
                                    entityID: dropTarget.id,
                                    key: 'linkedTo',
                                    data: undefined
                                }
                            })
                        }
                        else if (dropTarget && dropTarget !== current && current.linkedTo !== dropTarget.id) {
                            props.engine.dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE,
                                payload: {
                                    entityID: dropTarget.id,
                                    key: 'linkedTo',
                                    data: current.id
                                }
                            })
                        }
                    }}
                    onDragOver={e => {
                        e.preventDefault()
                    }}
                    selected={props.engine.selectedElement}
                    nodes={data}

                    handleRename={(treeNode, newName) => props.engine.dispatchEntities({
                        type: ENTITY_ACTIONS.UPDATE,
                        payload: {entityID: treeNode.id, key: 'name', data: newName}
                    })}/>

            </ContextMenu>
            <ResizableBar type={'height'}/>
            <div className={styles.wrapperContent}>
                <div className={styles.content}>
                    {currentForm}
                </div>
            </div>
        </div>
    )
}

SceneView.propTypes = {
    executingAnimation: PropTypes.bool,
    setAlert: PropTypes.func.isRequired,
    engine: PropTypes.object,
}