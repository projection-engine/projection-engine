import {TYPES} from "../../../components/flow/TYPES";
import Range from "../../../components/range/Range";
import styles from "../styles/NodeEditor.module.css";
import {Accordion, AccordionSummary, Checkbox, Dropdown, DropdownOption, DropdownOptions, TextField} from "@f-ui/core";
import React from "react";
import Getter from "../nodes/utils/Getter";
import {startKey} from "../nodes/utils/Setter";

export default function getInput(label, type, value, submit, obj, hook, selected){
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
                    {obj.options.find(o => o.data === hook.variables[selected][obj.key])?.label}
                    <DropdownOptions>
                        {obj.options?.map((o, i) => (
                            <React.Fragment key={'options-' + i}>
                                <DropdownOption option={{
                                    ...o,
                                    icon: o.data === hook.variables[selected][obj.key] ?
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