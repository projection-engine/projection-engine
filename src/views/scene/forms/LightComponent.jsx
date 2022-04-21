import PropTypes from "prop-types";
import styles from "../styles/Forms.module.css";
import {Accordion, AccordionSummary, Checkbox} from "@f-ui/core";
import React, {useEffect, useState} from "react";
import Range from "../../../components/range/Range";
import ColorPicker from "../../../components/color/ColorPicker";
import COMPONENTS from "../../../engine/shared/templates/COMPONENTS";
import {HISTORY_ACTIONS} from "../../../pages/project/utils/hooks/historyReducer";

export default function LightComponent(props) {
    const getNewState = () => {
        return {
            placement: props.selected.direction ? {
                x: props.selected.direction[0],
                y: props.selected.direction[1],
                z: props.selected.direction[2]
            } : {},

            attenuation: props.selected.attenuation ? {
                x: props.selected.attenuation[0],
                y: props.selected.attenuation[1],
                z: props.selected.attenuation[2]
            } : {},
            color: {
                r: props.selected.color[0],
                g: props.selected.color[1],
                b: props.selected.color[2]
            },
            size: props.selected.size,
            indirectAttenuation: props.selected.attenuation,
            lpvSamples: props.selected.lpvSamples,
            zNear: props.selected.zNear,
            zFar: props.selected.zFar,
            shadowMap: props.selected.shadowMap,
            intensity: props.selected.intensity
        }
    }
    const [state, setState] = useState(getNewState())
    useEffect(() => {
        setState(getNewState())
    }, [props.selected])
    const [hasChanged, setHasChanged] = useState(false)
    const saveVersion = () => {
        if (!hasChanged) {
            setHasChanged(true)
            props.engine.dispatchChanges({
                type: HISTORY_ACTIONS.SAVE_COMPONENT_STATE,
                payload: {
                    key: props.selected.constructor.name,
                    entityID: props.entityID,
                    component: props.selected
                }
            })
        }
    }

    return (
        <>
            {props.type === COMPONENTS.DIRECTIONAL_LIGHT || props.type === COMPONENTS.SKYLIGHT ?
                <>
                    <Accordion className={styles.fieldset} contentClassName={styles.formWrapper} contentStyles={{display: 'flex', gap: '2px'}}>
                        <AccordionSummary className={styles.summary}>
                            Direction
                        </AccordionSummary>
                        <Range
                            accentColor={'red'}
                            metric={'x'}
                            incrementPercentage={.01}
                            precision={2}
                            value={state.placement.x}
                            onFinish={(v) => {
                                setHasChanged(false)
                                props.submit([v, state.placement.y, state.placement.z], props.type === 'PointLightComponent' ? 'position' : 'direction')
                            }}
                            handleChange={e => {
                                saveVersion()
                                props.selected.direction = [parseFloat(e), state.placement.y, state.placement.z]
                                props.selected.changed = false
                                setState(prev => {
                                    return {
                                        ...prev, placement: {
                                            ...prev.placement,
                                            x: parseFloat(e)
                                        }
                                    }
                                })
                            }}/>
                        <Range
                            accentColor={'green'}
                            metric={'y'}
                            incrementPercentage={.01}
                            precision={2}
                            value={state.placement.y}
                            onFinish={(v) => {
                                setHasChanged(false)
                                props.submit([state.placement.x, v, state.placement.z], props.type === 'PointLightComponent' ? 'position' : 'direction')
                            }}
                            handleChange={e => {
                                saveVersion()
                                props.selected.direction = [state.placement.x, parseFloat(e), state.placement.z]
                                props.selected.changed = false
                                setState(prev => {
                                    return {
                                        ...prev, placement: {
                                            ...prev.placement,
                                            y: parseFloat(e)
                                        }
                                    }
                                })
                            }}/>
                        <Range
                            accentColor={'blue'}
                            metric={'z'}
                            incrementPercentage={.01}
                            precision={2}
                            value={state.placement.z}
                            onFinish={(v) => {
                                setHasChanged(false)
                                props.submit([state.placement.x, state.placement.y, v], props.type === 'PointLightComponent' ? 'position' : 'direction')
                            }}
                            handleChange={e => {
                                saveVersion()
                                props.selected.direction = [state.placement.x, state.placement.y, parseFloat(e)]
                                props.selected.changed = false

                                setState(prev => {
                                    return {
                                        ...prev, placement: {
                                            ...prev.placement,
                                            z: parseFloat(e)
                                        }
                                    }
                                })
                            }}/>
                    </Accordion>
                    <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}>
                        <AccordionSummary className={styles.summary}>
                            Size
                        </AccordionSummary>

                        <Range
                            accentColor={'yellow'}
                            value={state.size}
                            minValue={1}
                            incrementPercentage={1}
                            precision={0}
                            onFinish={(v) => {
                                setHasChanged(false)
                                props.submit(v, 'size')
                            }}
                            handleChange={e => {
                                saveVersion()
                                setState(prev => {
                                    return {
                                        ...prev,
                                        size: parseFloat(e)
                                    }
                                })
                            }}/>
                    </Accordion>
                </>
                :
                null
            }

            <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}>
                <AccordionSummary className={styles.summary}>
                    Intensity
                </AccordionSummary>

                <Range
                    accentColor={'yellow'}
                    value={state.intensity}
                    minValue={.0001}

                    precision={4}
                    onFinish={(v) => {
                        setHasChanged(false)
                        props.submit(v, 'intensity')
                    }}
                    handleChange={e => {
                        saveVersion()
                        props.selected.intensity = e
                        setState(prev => {
                            return {
                                ...prev,
                                intensity: e
                            }
                        })
                    }}/>
            </Accordion>
            {props.type === 'SkylightComponent' ?
                <>
                    <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}>
                        <AccordionSummary className={styles.summary}>
                            GI
                        </AccordionSummary>

                        <label className={styles.label} style={{marginBottom: '4px'}}>Intensity</label>
                        <Range
                            accentColor={'red'}
                            incrementPercentage={.01}
                            precision={2}
                            value={state.indirectAttenuation}
                            minValue={0}
                            onFinish={(v) => {
                                setHasChanged(false)
                                props.submit(v, 'attenuation')
                            }}
                            handleChange={e => {
                                saveVersion()
                                setState(prev => {
                                    return {
                                        ...prev,
                                        indirectAttenuation: parseFloat(e)
                                    }
                                })
                            }}/>

                        <label className={styles.label} style={{marginBottom: '4px'}}>Samples</label>
                        <Range
                            integer={true}
                            accentColor={'green'}
                            value={state.lpvSamples}
                            minValue={1}
                            maxValue={128}
                            onFinish={(v) => {
                                setHasChanged(false)
                                props.submit(v, 'lpvSamples')
                            }}
                            handleChange={e => {
                                saveVersion()
                                setState(prev => {
                                    return {
                                        ...prev,
                                        lpvSamples: parseInt(e)
                                    }
                                })
                            }}/>

                    </Accordion>

                </>
                :
                null
            }
            {props.type === 'PointLightComponent' ?
                <Accordion className={styles.fieldset} contentClassName={styles.formWrapper} contentStyles={{display: 'flex', gap: '2px'}}>
                    <AccordionSummary className={styles.summary}>
                        Light attenuation
                    </AccordionSummary>
                    <Range
                        accentColor={'red'}
                        incrementPercentage={.01}
                        minValue={.0001}
                        precision={2}
                        value={state.attenuation.x}
                        onFinish={(v) => {
                            setHasChanged(false)
                            props.submit([v, state.attenuation.y, state.attenuation.z], 'attenuation')
                        }}
                        handleChange={e => {
                            saveVersion()
                            props.selected.attenuation[0] = parseFloat(e)
                            setState(prev => {
                                return {
                                    ...prev, attenuation: {
                                        ...prev.attenuation,
                                        x: parseFloat(e)
                                    }
                                }
                            })
                        }}/>
                    <Range
                        accentColor={'green'}
                        incrementPercentage={.01}
                        minValue={.01}
                        precision={2}
                        value={state.attenuation.y}
                        onFinish={(v) => {
                            setHasChanged(false)
                            props.submit([state.attenuation.x,v, state.attenuation.z], 'attenuation')
                        }}
                        handleChange={e => {
                            saveVersion()
                            props.selected.attenuation[1] = parseFloat(e)
                            setState(prev => {
                                return {
                                    ...prev, attenuation: {
                                        ...prev.attenuation,
                                        y: parseFloat(e)
                                    }
                                }
                            })
                        }}/>
                    <Range
                        accentColor={'blue'}
                        incrementPercentage={.01}
                        minValue={.01}
                        precision={2}
                        value={state.attenuation.z}
                        onFinish={(v) => {
                            setHasChanged(false)
                            props.submit([state.attenuation.x, state.attenuation.y, v], 'attenuation')
                        }}
                        handleChange={e => {
                            saveVersion()
                            props.selected.attenuation[2] = parseFloat(e)
                            setState(prev => {
                                return {
                                    ...prev, attenuation: {
                                        ...prev.attenuation,
                                        z: parseFloat(e)
                                    }
                                }
                            })
                        }}/>

                </Accordion>
                :
                null
            }

            <Accordion className={styles.fieldset} contentClassName={styles.formWrapper} contentStyles={{display: 'flex', gap: '2px'}}>
                <AccordionSummary className={styles.summary}>
                    Planes
                </AccordionSummary>
                <Range
                    accentColor={'red'}
                    value={state.zFar}
                    metric={'Far'}
                    precision={3}
                    incrementPercentage={.01}
                    onFinish={(v) => {
                        setHasChanged(false)
                        props.submit(v, 'zFar')
                    }}
                    handleChange={e => {
                        saveVersion()
                        setState(prev => {
                            return {
                                ...prev,
                                zFar: e
                            }
                        })
                    }}
                />
                <Range
                    accentColor={'green'}
                    value={state.zNear}
                    metric={'Near'}
                    precision={3}
                    incrementPercentage={.01}
                    onFinish={(v) => {
                        setHasChanged(false)
                        props.submit(v, 'zNear')
                    }}
                    handleChange={e => {
                        saveVersion()

                        setState(prev => {
                            return {
                                ...prev,
                                zNear: e
                            }
                        })
                    }}/>
            </Accordion>
            <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}>
                <AccordionSummary className={styles.summary}>
                    Color
                </AccordionSummary>

                <ColorPicker
                    value={state.color}
                    submit={color => {
                        saveVersion()
                        setHasChanged(false)
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

            </Accordion>


            <Checkbox
                noMargin={true}
                label={'Shadow map'}
                width={'100%'}
                height={'35px'}
                checked={state.shadowMap}
                handleCheck={() => {
                    saveVersion()
                    setHasChanged(false)

                    setState({...state, shadowMap: !state.shadowMap})
                    props.submit(!state.shadowMap, 'shadowMap')
                }}/>

        </>

    )
}

LightComponent.propTypes = {
    engine: PropTypes.object,
    entityID: PropTypes.string,


    type: PropTypes.oneOf(['PointLightComponent', 'DirectionalLightComponent']),
    selected: PropTypes.object,

    submitAttenuation: PropTypes.func,
    submitPlacement: PropTypes.func,
    submitColor: PropTypes.func
}
