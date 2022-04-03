import React, {useMemo} from "react";
import styles from '../styles/Structure.module.css'
import PropTypes from "prop-types";

import {Accordion, AccordionSummary, Button, ContextMenu, Ripple,} from "@f-ui/core";
import {TYPES} from "../../../components/flow/TYPES";
import randomID from "../../../services/utils/misc/randomID";
import deleteNode from "../../../components/flow/utils/deleteNode";
import NODE_TYPES from "../../../components/flow/NODE_TYPES";
import mapToView from "../../scene/utils/mapToView";
import {ENTITY_ACTIONS} from "../../../services/utils/entityReducer";
import TreeView from "../../../components/tree/TreeView";

export default function Structure(props) {
    const {
        selectedVariable, setSelectedVariable
    } = props

    const events = useMemo(() => {
        return props.hook.nodes.filter(n => n.type === NODE_TYPES.START_POINT)
    }, [props.hook.nodes])

    const getName = (prev) => {
        let n = 'New Variable'
        let it = 0

        while (prev.filter(e => e.name === n).length > 0) {
            it++
            n = 'New Variable' + `(${it})`
        }

        return n
    }


    const getType = (t) => {
        switch (t) {
            case TYPES.VEC2:
                return 'Vector 2D'
            case TYPES.VEC3:
                return 'Vector 3D'
            case TYPES.VEC4:
                return 'Vector 4D'
            case TYPES.NUMBER:
                return 'Number'
            case TYPES.BOOL:
                return 'Boolean'
            default:
                break
        }
    }

    const data = useMemo(() => {
        let toFilter = props.engine.entities.filter(d => !d.linkedTo && !d.components.Grid)
        return [{
            id: 0,
            label: 'Blueprint',
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
                }, props.engine)
            }),
            icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>inventory_2</span>,
            type: 'Scene',
            phantomNode: true
        }]
    }, [props.engine.entities])


    return (
        <div className={styles.wrapper} style={{width: '275px'}}>
            <TreeView
                contextTriggers={[
                    'data-node',
                    'data-self'
                ]}
                draggable={props.openTab === 1 || props.isLevelBlueprint}

                searchable={true}
                options={[
                    {
                        requiredTrigger: 'data-node',
                        label: 'Remove entity',
                        icon: <span className={'material-icons-round'}>delete</span>,
                        onClick: (node) => {
                            const toDelete = [...props.engine.selected, node.getAttribute('data-node')]
                            props.engine.setSelected([])
                            props.engine.dispatchEntities({
                                type: ENTITY_ACTIONS.REMOVE_BLOCK,
                                payload: toDelete
                            })

                        }
                    }
                ]}
                selected={props.engine.selected}
                nodes={data}
                styles={{maxHeight: '50%'}}
                handleRename={(treeNode, newName) => {
                    props.engine.dispatchEntities({
                        type: ENTITY_ACTIONS.UPDATE,
                        payload: {entityID: treeNode.id, key: 'name', data: newName}
                    })
                }}
            />

            <Accordion className={styles.options}>
                <AccordionSummary>
                    Events
                </AccordionSummary>
                {events.map(g => (
                    <div className={styles.option} onDoubleClick={() => {
                        props.focusNode(g.id)
                    }}>
                         <span className={'material-icons-round'}
                               style={{fontSize: '1.1rem'}}>output</span>
                        {g.name}
                        <Ripple accentColor={'var(--fabric-accent-color)'} opacity={'.1'}/>
                    </div>
                ))}
            </Accordion>
            <Accordion className={styles.options}>
                <AccordionSummary>
                    Variables
                </AccordionSummary>
                <ContextMenu
                    options={[{
                        requiredTrigger: 'data-var',
                        onClick: (n) => {
                            setSelectedVariable(undefined)
                            const allN = props.hook.nodes.filter(nn => nn.id.includes(n.getAttribute('data-var')))
                            allN.forEach(nn => {
                                deleteNode(nn.id, props.hook, () => null)
                            })
                            props.hook.setVariables(p => {
                                return p.filter(pp => pp.id !== n.getAttribute('data-var'))
                            })
                        },
                        label: 'Delete variable',
                        icon: <span className={'material-icons-round'}
                                    style={{fontSize: '1.1rem'}}>delete_forever</span>
                    }]}
                    triggers={['data-var']}
                >
                    <Button
                        className={styles.option}
                        styles={{borderRadius: 0}}
                        variant={'filled'}

                        onClick={() => {
                            props.hook.setVariables(prev => {
                                return [...prev, {
                                    id: randomID(),
                                    name: getName(prev),
                                    type: TYPES.NUMBER
                                }]
                            })
                        }}>

                        <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>add</span>
                        Add new variable
                    </Button>
                    {props.hook.variables.map(g => (
                        <div
                            data-highlight={`${selectedVariable === g.id}`}
                            className={styles.option}
                            onClick={() => {
                                props.hook.setSelected([])
                                setSelectedVariable(g.id)
                            }}
                            data-var={g.id}>
                            <div>
                                {g.name}
                            </div>

                            <div style={{fontWeight: '500', fontSize: '.65rem'}}>
                                {getType(g.type)}
                            </div>

                        </div>
                    ))}
                </ContextMenu>
            </Accordion>

        </div>
    )
}

Structure.propTypes = {
    openTab: PropTypes.number,
    focusNode: PropTypes.func,
    selectedVariable: PropTypes.string,
    setSelectedVariable: PropTypes.func,

    hook: PropTypes.object,
    engine: PropTypes.object,
    isLevelBlueprint: PropTypes.bool
}