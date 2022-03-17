import PropTypes from "prop-types";
import styles from './styles/Scene.module.css'
import React, {useContext, useMemo, useState} from "react";

import TreeView from "../../components/tree/TreeView";
import mapToView from "./utils/mapToView";
import useForm from "./utils/useForm";
import QuickAccessProvider from "../../services/hooks/QuickAccessProvider";

import {Button, Dropdown, DropdownOption, DropdownOptions, LoaderProvider} from "@f-ui/core";
import FolderComponent from "../../services/engine/ecs/components/FolderComponent";
import {ENTITY_ACTIONS} from "../../services/utils/entityReducer";
import Entity from "../../services/engine/ecs/basic/Entity";
import ResizableBar from "../../components/resizable/ResizableBar";
import PointLightComponent from "../../services/engine/ecs/components/PointLightComponent";
import DirectionalLightComponent from "../../services/engine/ecs/components/DirectionalLightComponent";
import SkylightComponent from "../../services/engine/ecs/components/SkyLightComponent";
import FormTabs from "./forms/FormTabs";
import Transformation from "../../services/engine/utils/workers/Transformation";
import ROTATION_TYPES from "../../services/engine/utils/misc/ROTATION_TYPES";
import {glMatrix, mat4, quat} from "gl-matrix";

export default function SceneView(props) {
    const quickAccess = useContext(QuickAccessProvider)

    const [allHidden, setAllHidden] = useState(false)
    const [hidden, setHidden] = useState(false)
    const [currentTab, setCurrentTab] = useState(0)

    const load = useContext(LoaderProvider)
    const data = useMemo(() => {
        let toFilter = props.engine.entities.filter(d => !d.linkedTo && !d.components.Grid)
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
    }, [props.engine.entities])


    const currentForm = useForm(
        props.engine,
        props.engine.selected,
        props.setAlert,
        props.executingAnimation,

        quickAccess,
        load,
        currentTab
    )

    const options = useMemo(() => {


        return [
            {
                label: 'Point light',
                icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>lightbulb</span>,
                instance: () => new PointLightComponent()
            },
            {
                label: 'Directional light',
                icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>light_mode</span>,
                instance: () => new DirectionalLightComponent()
            },
            {
                label: 'Sky light',
                icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>light_mode</span>,
                instance: () => new SkylightComponent()
            },
        ]
    }, [props.engine.entities])


    const createFolder = () => {
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
                                    props.engine.dispatchEntities({
                                        type: ENTITY_ACTIONS.REMOVE_BLOCK,
                                        payload: props.engine.selected
                                    })
                                    props.engine.setSelected([])
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
                                <Dropdown styles={{height: '20px', width: '20px'}} className={styles.button}
                                          variant={"outlined"}>
                                    <DropdownOptions>
                                        {options.map((o, i) => (
                                            <React.Fragment key={i + '-option-scene'}>
                                                <DropdownOption option={{
                                                    ...o,
                                                    onClick: () => {
                                                        props.engine.dispatchEntities({
                                                            type: ENTITY_ACTIONS.ADD_COMPONENT,
                                                            payload: {
                                                                entityID: currentForm.selected?.id,
                                                                data: o.instance()
                                                            }
                                                        })
                                                    }
                                                }}/>
                                            </React.Fragment>
                                        ))}
                                    </DropdownOptions>
                                </Dropdown>
                            </div>
                        ) : null}

                        <div className={styles.content}>
                            {currentForm.open ?
                                <FormTabs entity={currentForm.selected} currentTab={currentTab}
                                          setCurrentTab={setCurrentTab}/>
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