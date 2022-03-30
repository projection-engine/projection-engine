import React, {useMemo} from "react";
import styles from '../styles/Structure.module.css'
import PropTypes from "prop-types";

import {Accordion, AccordionSummary, Button, ContextMenu, Ripple,} from "@f-ui/core";
import {TYPES} from "../../../components/flow/TYPES";
import randomID from "../../../services/utils/misc/randomID";
import deleteNode from "../../../components/flow/utils/deleteNode";
import NODE_TYPES from "../../../components/flow/NODE_TYPES";

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

    return (
        <div className={styles.wrapper} style={{width: '275px'}}>
            <Accordion className={styles.options}>
                <AccordionSummary>
                    Events
                </AccordionSummary>
                {events.map(g => (
                    <div className={styles.option} onDoubleClick={() => {props.focusNode(g.id)}}>
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
                                setSelectedVariable(g.id)
                                props.hook.setSelected(props.hook.nodes.filter(nn => nn.id.includes(g.id)).map(nn => nn.id))
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
    focusNode: PropTypes.func,
    selectedVariable: PropTypes.string,
    setSelectedVariable: PropTypes.func,
    selected: PropTypes.string,
    hook: PropTypes.object
}