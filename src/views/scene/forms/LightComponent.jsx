import PropTypes from "prop-types";
import styles from "../styles/Forms.module.css";
import {Accordion, AccordionSummary, Checkbox} from "@f-ui/core";
import React, {useEffect, useState} from "react";
import Range from "../../../components/range/Range";
import ColorPicker from "../../../components/color/ColorPicker";
import COMPONENTS from "../../../services/engine/templates/COMPONENTS";
import {HISTORY_ACTIONS} from "../../../services/utils/historyReducer";

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
                r: props.selected.color[0] ,
                g: props.selected.color[1] ,
                b: props.selected.color[2]
            },
            size: props.selected.size,
            indirectAttenuation: props.selected.attenuation,
            lpvSamples: props.selected.lpvSamples,
            zNear: props.selected.zNear,
            zFar: props.selected.zFar,
            shadowMap: props.selected.shadowMap
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
                    <Accordion className={styles.fieldset}>
                        <AccordionSummary className={styles.summary}>
                            Direction
                        </AccordionSummary>
                        <div className={styles.inputsColumn}>
                            <div className={styles.inputs}>
                                <Range
                                    accentColor={'red'}
                                    metric={'x'}
                                    incrementPercentage={.01}
                                    precision={2}
                                    value={state.placement.x}
                                    onFinish={() => {
                                        setHasChanged(false)
                                        props.submit([state.placement.x, state.placement.y, state.placement.z], props.type === 'PointLightComponent' ? 'position' : 'direction')
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
                                    onFinish={() => {
                                        setHasChanged(false)
                                        props.submit([state.placement.x, state.placement.y, state.placement.z], props.type === 'PointLightComponent' ? 'position' : 'direction')
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
                                    onFinish={() => {
                                        setHasChanged(false)
                                        props.submit([state.placement.x, state.placement.y, state.placement.z], props.type === 'PointLightComponent' ? 'position' : 'direction')
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

                            </div>
                        </div>
                    </Accordion>
                    <Accordion className={styles.fieldset}>
                        <AccordionSummary className={styles.summary}>
                            Size
                        </AccordionSummary>
                        <div className={styles.inputsColumn}>
                            <Range
                                accentColor={'yellow'}
                                value={state.size}
                                minValue={1}
                                incrementPercentage={1}
                                precision={0}
                                onFinish={() => {
                                    setHasChanged(false)
                                    props.submit(state.size, 'size')
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
                        </div>
                    </Accordion>
                </>
                :
                null
            }
            {props.type === 'SkylightComponent' ?
                <>
                    <Accordion className={styles.fieldset}>
                        <AccordionSummary className={styles.summary}>
                            GI
                        </AccordionSummary>
                        <div className={styles.inputsColumn}>
                            <label className={styles.label} style={{marginBottom: '4px'}}>Intensity</label>
                            <Range
                                accentColor={'red'}
                                incrementPercentage={.01}
                                precision={2}
                                value={state.indirectAttenuation}
                                minValue={0}
                                onFinish={() => {
                                    setHasChanged(false)
                                    props.submit(state.indirectAttenuation, 'attenuation')
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
                                onFinish={() => {
                                    setHasChanged(false)
                                    props.submit(state.lpvSamples, 'lpvSamples')
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
                        <Range
                            accentColor={'red'}
                            incrementPercentage={.01}
                            minValue={.0001}
                            precision={2}
                            value={state.attenuation.x}
                            onFinish={() => {
                                setHasChanged(false)
                                props.submit([state.attenuation.x, state.attenuation.y, state.attenuation.z], 'attenuation')
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
                            onFinish={() => {
                                setHasChanged(false)
                                props.submit([state.attenuation.x, state.attenuation.y, state.attenuation.z], 'attenuation')
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
                            onFinish={() => {
                                setHasChanged(false)
                                props.submit([state.attenuation.x, state.attenuation.y, state.attenuation.z], 'attenuation')
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
                    </div>
                </Accordion>
                :
                null
            }

            <Accordion>
                <AccordionSummary className={styles.summary}>
                    Planes
                </AccordionSummary>

                <div className={styles.inputs}>
                    <Range
                        accentColor={'red'}
                        value={state.zFar}
                        metric={'Far'}
                        precision={3}
                        incrementPercentage={.01}
                        onFinish={() => {
                            setHasChanged(false)
                            props.submit(parseFloat(state.zFar), 'zFar')
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
                        onFinish={() => {
                            setHasChanged(false)
                            props.submit(parseFloat(state.zNear), 'zNear')
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

                </div>
            </Accordion>
            <Accordion>
                <AccordionSummary className={styles.summary}>
                    Color
                </AccordionSummary>
                <div className={styles.inputs} style={{justifyContent: 'space-between'}}>
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
                </div>
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
