import PropTypes from "prop-types";
import styles from './styles/Scene.module.css'
import React, {useContext, useMemo, useState} from "react";

import TreeView from "../../components/tree/TreeView";
import mapToView from "./utils/mapToView";
import useForm from "./utils/useForm";
import QuickAccessProvider from "../../services/hooks/QuickAccessProvider";

import {Button, ContextMenu, LoaderProvider} from "@f-ui/core";
import FolderComponent from "../../services/engine/ecs/components/FolderComponent";
import {ENTITY_ACTIONS} from "../../services/engine/utils/entityReducer";
import Entity from "../../services/engine/ecs/basic/Entity";
import Search from "../../components/search/Search";
import ResizableBar from "../../components/resizable/ResizableBar";
import ThemeProvider from "../../services/hooks/ThemeProvider";
import SelectBox from "../../components/selectbox/SelectBox";

export default function SceneView(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const [searchString, setSearchString] = useState('')
    const theme = useContext(ThemeProvider)
    const load = useContext(LoaderProvider)
    const data = useMemo(() => {
        let toFilter = props.engine.entities.filter(d => !d.linkedTo && !d.components.GridComponent && (searchString.length > 0 ? d.name.toLowerCase().includes(searchString) : true))
        return [{
            id: 0,
            label: 'Scene',
            children: toFilter.map(f => {
                return mapToView(f, props.engine.entities, (el, e) => {
                    if(e.ctrlKey)
                        props.engine.setSelected(prev => {
                            if(!prev.includes(el))
                                return [...prev, el]
                            else
                                return  prev
                        })
                    else
                        props.engine.setSelected([el])
                })
            }),
            icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>inventory_2</span>,
            type: 'Scene',
            phantomNode: true
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
                triggers={['data-self', 'data-node']}
                className={[styles.wrapperContent, theme.backgroundStripesClass].join(' ')}>

                <SelectBox nodes={props.engine.entities} selected={props.engine.selected} setSelected={props.engine.setSelected}/>
                <Search width={'100%'} searchString={searchString} setSearchString={setSearchString}/>

                <TreeView
                    draggable={true}
                    onDrop={(event, target) => {
                        event.preventDefault()
                        const current = props.engine.entities.find(f => f.id === target)
                        const dropTarget = props.engine.entities.find(f => f.id === event.dataTransfer.getData('text'))

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
                    }}
                    onDragOver={e => {
                        e.preventDefault()
                    }}
                    selected={props.engine.selected}
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