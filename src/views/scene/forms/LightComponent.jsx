import PropTypes from "prop-types";
import styles from "../styles/Forms.module.css";
import {Accordion, AccordionSummary} from "@f-ui/core";
import React, {useEffect, useState} from "react";
import Range from "../../../components/range/Range";
import ColorPicker from "../../../components/color/ColorPicker";

export default function LightComponent(props) {
    const getNewState = () => {
        return {
            placement: {
                x: props.selected[props.type === 'PointLightComponent' ? 'position' : 'direction'][0],
                y: props.selected[props.type === 'PointLightComponent' ? 'position' : 'direction'][1],
                z: props.selected[props.type === 'PointLightComponent' ? 'position' : 'direction'][2]
            },

            attenuation: props.type === 'PointLightComponent' ? {
                x: props.selected.attenuation[0],
                y: props.selected.attenuation[1],
                z: props.selected.attenuation[2]
            } : {},
            color: {
                r: props.selected.color[0] * 255,
                g: props.selected.color[1] * 255,
                b: props.selected.color[2] * 255
            },
            size: props.selected.size,
            indirectAttenuation: props.selected.attenuation,
            lpvSamples: props.selected.lpvSamples
        }
    }
    const [state, setState] = useState(getNewState())
    useEffect(() => {
        setState(getNewState())
    }, [props.selected])

    const getInputs = (key, values, onChange, labels) => {
        return (
            <>
                <Range
                    accentColor={'red'}
                    label={labels[0]}
                    value={state[key][values[0]]}
                    onFinish={() => onChange(undefined, values[0], true)}
                    handleChange={e => onChange(parseFloat(e), values[0], false)}/>
                <Range
                    accentColor={'green'}
                    label={labels[1]}
                    value={state[key][values[1]]}
                    onFinish={() => onChange(undefined, values[1], true)}
                    handleChange={e => onChange(parseFloat(e), values[1], false)}/>
                <Range
                    accentColor={'blue'}
                    label={labels[2]}
                    value={state[key][values[2]]}
                    onFinish={() => onChange(undefined, values[2], true)}
                    handleChange={e => onChange(parseFloat(e), values[2], false)}/>
            </>
        )
    }

    return (
        <>
            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    {props.type === 'PointLightComponent' ? 'Position' : 'Direction'}
                </AccordionSummary>
                <div className={styles.inputsColumn}>
                    <div className={styles.inputs}>
                        {getInputs(
                            'placement',
                            ['x', 'y', 'z'],
                            (e, field, finalSubmit) => {
                                const k = props.type === 'PointLightComponent' ? 'position' : 'direction'
                                if (!finalSubmit) {
                                    switch (field) {
                                        case 'x':
                                            props.selected[k] = [e, props.selected[k][1], props.selected[k][2]]
                                            break
                                        case 'y':
                                            props.selected[k] = [props.selected[k][0], e, props.selected[k][2]]
                                            break
                                        case 'z':
                                            props.selected[k] = [props.selected[k][0], props.selected[k][1], e]
                                            break
                                    }
                                    setState(prev => {

                                        return {
                                            ...prev, placement: {
                                                ...prev.placement,
                                                [field]: e
                                            }
                                        }
                                    })
                                } else
                                    props.submit([state.placement.x, state.placement.y, state.placement.z], k)
                            },
                            ['x', 'y', 'z']
                        )}
                    </div>
                </div>
            </Accordion>
            {props.type === 'DirectionalLightComponent'  || props.type === 'SkylightComponent'?
                <Accordion className={styles.fieldset}>
                    <AccordionSummary className={styles.summary}>
                        Size
                    </AccordionSummary>
                    <div className={styles.inputsColumn}>
                        <Range
                            accentColor={'yellow'}
                            value={state.size}
                            minValue={1}
                            onFinish={() => props.submit(state.size, 'size')}
                            handleChange={e => setState(prev => {
                                return {
                                    ...prev,
                                    size: parseFloat(e)
                                }
                            })}/>
                    </div>
                </Accordion>
                :
                null
            }
            {props.type === 'SkylightComponent'?
                <>
                    <Accordion className={styles.fieldset}>
                        <AccordionSummary className={styles.summary}>
                            Indirect light attenuation
                        </AccordionSummary>
                        <div className={styles.inputsColumn}>
                            <Range
                                accentColor={'yellow'}
                                value={state.indirectAttenuation}
                                minValue={0}
                                onFinish={() => props.submit(state.indirectAttenuation, 'attenuation')}
                                handleChange={e => setState(prev => {
                                    return {
                                        ...prev,
                                        indirectAttenuation: parseFloat(e)
                                    }
                                })}/>
                        </div>
                    </Accordion>
                <Accordion className={styles.fieldset}>
                    <AccordionSummary className={styles.summary}>
                        Propagation samples
                    </AccordionSummary>
                    <div className={styles.inputsColumn}>
                        <Range
                            integer={true}
                            accentColor={'yellow'}
                            value={state.lpvSamples}
                            minValue={1}
                            maxValue={128}
                            onFinish={() => props.submit(state.lpvSamples, 'lpvSamples')}
                            handleChange={e => setState(prev => {
                                return {
                                    ...prev,
                                    lpvSamples: parseInt(e)
                                }
                            })}/>
                    </div>
                </Accordion>
                </>
                :
                null
            }
            {props.type === 'PointLightComponent' ?
                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        Light attenuation
                    </AccordionSummary>
                    <div className={styles.inputs}>
                        {getInputs(
                            'attenuation',
                            ['x', 'y', 'z'],
                            (e, field, finalSubmit) => {
                                if (!finalSubmit) {
                                    switch (field) {
                                        case 'x':
                                            props.selected.attenuation[0] = e
                                            break
                                        case 'y':
                                            props.selected.attenuation[1] = e
                                            break
                                        case 'z':
                                            props.selected.attenuation[2] = e
                                            break
                                    }
                                    setState(prev => {
                                        return {
                                            ...prev, attenuation: {
                                                ...prev.attenuation,
                                                [field]: e
                                            }
                                        }
                                    })
                                } else
                                    props.submit([state.attenuation.x, state.attenuation.y, state.attenuation.z], 'attenuation')

                            },
                            ['Constant', 'Linear', 'Quadratic']
                        )}
                    </div>
                </Accordion>
                :
                null
            }
            <Accordion>
                <AccordionSummary className={styles.summary}>
                    Light color
                </AccordionSummary>
                <div className={styles.inputs} style={{justifyContent: 'space-between'}}>
                    <ColorPicker
                        value={state.color} submit={color => {
                        const split = color.match(/[\d.]+/g)
                        const [r, g, b] = split.map(v => parseFloat(v))
                        setState(prev => {
                            return {
                                ...prev,
                                color: {r: r, g: g, b: b}
                            }
                        })
                        props.submit([r, g, b], 'color')
                    }}/>
                </div>
            </Accordion>
        </>

    )
}

LightComponent.propTypes = {
    type: PropTypes.oneOf(['PointLightComponent', 'DirectionalLightComponent']),
    selected: PropTypes.object,

    submitAttenuation: PropTypes.func,
    submitPlacement: PropTypes.func,
    submitColor: PropTypes.func
}
