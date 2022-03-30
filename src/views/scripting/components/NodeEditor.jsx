import React, {useMemo} from "react";
import styles from '../styles/NodeEditor.module.css'
import PropTypes from "prop-types";

import {Accordion, AccordionSummary, Checkbox, Dropdown, DropdownOption, DropdownOptions, TextField,} from "@f-ui/core";
import Range from "../../../components/range/Range";
import {TYPES} from "../../../components/flow/TYPES";
import Getter from "../nodes/utils/Getter";
import {startKey} from "../nodes/utils/Setter";

export default function NodeEditor(props) {
    const {
        selectedVariable
    } = props
    const selected = useMemo(() => {
        return props.hook.variables.findIndex(v => v.id === selectedVariable)
    }, [selectedVariable, props.hook.variables])
    const attributes = useMemo(() => {
        let res = []
        if (selectedVariable) {
            const type = props.hook.variables[selected].type
            switch (type) {
                case TYPES.VEC2:
                    res = [{label: 'Vector', key: 'value', type: TYPES.VEC2}]
                    break
                case TYPES.VEC3:
                    res = [{label: 'Vector', key: 'value', type: TYPES.VEC3}]
                    break
                case TYPES.VEC4:
                    res = [{label: 'Vector', key: 'value', type: TYPES.VEC4}]
                    break
                case TYPES.NUMBER:
                    res = [{label: 'Value', key: 'value', type: TYPES.NUMBER}]
                    break
                case TYPES.BOOL:
                    res = [
                        {label: 'Is truthful', key: 'value', type: TYPES.BOOL}
                    ]
                    break
                default:
                    break
            }

            res.push({
                label: 'Variable Type', key: 'type', type: TYPES.OPTIONS,
                options: [
                    {label: 'Vector 2D', data: TYPES.VEC2},
                    {label: 'Vector 3D', data: TYPES.VEC3},
                    {label: 'Vector 4D', data: TYPES.VEC4},
                    {label: 'Number', data: TYPES.NUMBER},
                    {label: 'Boolean', data: TYPES.BOOL}
                ]

            })
        }

        return res
    }, [selected, props.hook.variables])


    const getInput = (label, type, value, submit, obj) => {
        switch (type) {
            case TYPES.NUMBER:
                return (
                    <Range
                        accentColor={'red'}
                        precision={3}
                        maxValue={obj.max}
                        incrementPercentage={.01}
                        minValue={obj.min}
                        value={value !== undefined ? value : 0}
                        handleChange={submit} label={label}/>
                )
            case TYPES.VEC2:
            case TYPES.VEC3:
            case TYPES.VEC4:
                return (
                    <div className={styles.vecWrapper}>
                        <Range
                            accentColor={'red'}
                            precision={3}
                            maxValue={obj.max}
                            incrementPercentage={.01}
                            minValue={obj.min}
                            value={value ? value[0] : undefined}
                            handleChange={v => {
                                const c = [...value]
                                c[0] = parseFloat(v)
                                submit(c)
                            }}
                            label={label}/>
                        <Range accentColor={'green'}
                               precision={3}
                               maxValue={obj.max}
                               incrementPercentage={.01}
                               minValue={obj.min}
                               value={value ? value[1] : undefined}
                               handleChange={v => {
                                   const c = [...value]
                                   c[1] = parseFloat(v)
                                   submit(c)
                               }}
                               label={label}/>
                        {type === TYPES.VEC3 || type === TYPES.VEC4 ?
                            <Range
                                accentColor={'blue'}
                                precision={3}
                                maxValue={obj.max}
                                incrementPercentage={.01}
                                minValue={obj.min}
                                value={value ? value[2] : undefined}
                                handleChange={v => {
                                    const c = [...value]
                                    c[2] = parseFloat(v)
                                    submit(c)
                                }}
                                label={label}/>
                            : null}
                        {type === TYPES.VEC4 ?
                            <Range
                                accentColor={'yellow'}
                                precision={3}
                                maxValue={obj.max}
                                incrementPercentage={.01}
                                minValue={obj.min}
                                value={value ? value[3] : undefined}
                                handleChange={v => {
                                    const c = [...value]
                                    c[3] = parseFloat(v)
                                    submit(c)
                                }}
                                label={label}/>
                            : null}
                    </div>
                )

            case TYPES.BOOL:
                return <Checkbox label={label} checked={value} handleCheck={() => submit(!value)}/>
            case TYPES.OPTIONS:
                return (
                    <Dropdown styles={{width: '100%', justifyContent: 'space-between'}}>
                        {obj.options.find(o => o.data === props.hook.variables[selected][obj.key])?.label}
                        <DropdownOptions>
                            {obj.options?.map((o, i) => (
                                <React.Fragment key={'options-' + i}>
                                    <DropdownOption option={{
                                        ...o,
                                        icon: o.data === props.hook.variables[selected][obj.key] ?
                                            <span style={{fontSize: '1.1rem'}}
                                                  className={'material-icons-round'}>check</span> : null,
                                        onClick: () => {
                                            submit(o.data)
                                        }
                                    }}/>
                                </React.Fragment>
                            ))}
                        </DropdownOptions>
                    </Dropdown>
                )
            default:
                return
        }
    }


    const getNewValue = (type) => {
        switch (type) {
            case TYPES.VEC2:
                return [0, 0]
            case TYPES.VEC3:
                return [0, 0, 0]
            case TYPES.VEC4:
                return [0, 0, 0, 0]
            case TYPES.NUMBER:
                return 0
            case TYPES.BOOL:
                return false
            default:
                break
        }
    }
    return (
        <div className={styles.wrapper}>
            {selectedVariable ?
                <div className={styles.form}>
                    {selectedVariable ?
                        <TextField
                            value={props.hook.variables[selected].name}
                            width={'100%'}
                            height={'35px'}
                            handleChange={ev => {
                                props.hook.setVariables(prev => {
                                    const n = [...prev]
                                    const classLocation = n.find(e => e.id === selectedVariable)
                                    classLocation.name = ev.target.value
                                    return n
                                })
                            }}
                            label={'Name'}
                            placeholder={'Name'}/>
                        : null}
                    {attributes.map((attr, i) => (
                        <React.Fragment key={attr.label + '-attribute-' + i}>
                            <Accordion>
                                <AccordionSummary>
                                    {attr.key === 'type' ? 'Variable Type' : 'Variable Value'}
                                </AccordionSummary>
                                <div className={styles.content}>
                                    {getInput(
                                        attr.label,
                                        attr.type,
                                        props.hook.variables[selected][attr.key],
                                        (event) => props.hook.setVariables(prev => {
                                            const n = [...prev]
                                            const classLocation = n.find(e => e.id === selectedVariable)
                                            classLocation[attr.key] = event
                                            if (attr.key === 'type') {
                                                classLocation.value = getNewValue(event)
                                                props.hook.setNodes(prevN => {
                                                    return [...prevN].map(node => {
                                                        if (node.id.includes(selectedVariable)) {
                                                            if (node instanceof Getter)
                                                                node.output = [{
                                                                    label: 'Value',
                                                                    key: 'value',
                                                                    type: event
                                                                }]
                                                            else {
                                                                node.inputs = [{
                                                                    label: 'Start',
                                                                    key: startKey,
                                                                    accept: [TYPES.EXECUTION]
                                                                }, {label: 'Value', key: 'value', accept: [event]}]
                                                                node.output = [
                                                                    {
                                                                        label: 'Execute',
                                                                        key: 'EXECUTION',
                                                                        type: TYPES.EXECUTION
                                                                    },
                                                                    {label: 'Value', key: 'value', type: event}
                                                                ]
                                                            }
                                                        }
                                                        return node
                                                    })
                                                })
                                            }

                                            return n
                                        }),
                                        attr)}
                                </div>
                            </Accordion>
                        </React.Fragment>
                    ))}
                    {selectedVariable ? (
                        <div className={styles.buttonGroup}>
                            <div
                                className={styles.option}
                                draggable={true}
                                onDragStart={e => e.dataTransfer.setData('text', JSON.stringify({
                                    key: props.hook.variables[selected].id,
                                    type: 'getter'
                                }))}
                            >
                                <span style={{fontSize: '1.1rem'}}  className={'material-icons-round'}>drag_indicator</span>
                                Getter
                            </div>
                            <div
                                className={styles.option}
                                draggable={true}
                                onDragStart={e => e.dataTransfer.setData('text', JSON.stringify({
                                    key: props.hook.variables[selected].id,
                                    type: 'setter'
                                }))}
                            >
                                <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>drag_indicator</span>
                                Setter
                            </div>
                        </div>
                    ) : null}
                </div>
                :
                <div className={styles.emptyWrapper}>
                    <span style={{fontSize: '90px'}}
                          className={'material-icons-round'}>category</span>
                    Select a variable to edit it.
                </div>
            }

        </div>
    )
}

NodeEditor.propTypes = {
    selectedVariable: PropTypes.string,
    selected: PropTypes.string,
    hook: PropTypes.object
}