import PropTypes from "prop-types"
import {Checkbox} from "@f-ui/core"
import React, {useEffect, useState} from "react"
import ColorPicker from "../../../../components/color/ColorPicker"
import COMPONENTS from "../../../engine/data/COMPONENTS"
import AccordionTemplate from "../../../../components/accordion/AccordionTemplate"
import Range from "../../../../components/range/Range"

export default function Lights(props) {
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


    const dirKey = props.type === COMPONENTS.POINT_LIGHT ? "position" : "direction"
    return (
        <>
            {props.type === COMPONENTS.DIRECTIONAL_LIGHT || props.type === COMPONENTS.SKYLIGHT ?
                <>
                    <AccordionTemplate title={"Direction"} >
                        <Range
                            variant={"embedded"}
                            label={"X"}
                            incrementPercentage={.01}
                            precision={2}
                            value={state.placement.x}
                            onFinish={(v) => {
                                props.submit([ v, state.placement.y, state.placement.z], dirKey)
                                setState({
                                    ...state,
                                    placement: {
                                        ...state.placement,
                                        x: v
                                    }
                                })
                            }}
                            handleChange={e => props.selected[dirKey] = [e, state.placement.y, state.placement.z]}/>
                        <Range
                            label={"Y"}
                            variant={"embedded"}
                            incrementPercentage={.01}
                            precision={2}
                            value={state.placement.y}
                            onFinish={(v) => {
                                props.submit([state.placement.x,  v, state.placement.z], dirKey)
                                setState({
                                    ...state,
                                    placement: {
                                        ...state.placement,
                                        y: v
                                    }
                                })
                            }}
                            handleChange={e => props.selected[dirKey] = [state.placement.x, e, state.placement.z]}/>
                        <Range
                            label={"Z"}
                            variant={"embedded"}
                            incrementPercentage={.01}
                            precision={2}
                            value={state.placement.z}
                            onFinish={(v) => {
                                props.submit([state.placement.x, state.placement.y, v], dirKey)
                                setState({
                                    ...state,
                                    placement: {
                                        ...state.placement,
                                        z: v
                                    }
                                })
                            }}
                            handleChange={e => props.selected[dirKey] = [state.placement.x, state.placement.y, e]}/>
                    </AccordionTemplate>

                </>
                :
                null
            }
            
            {props.type === COMPONENTS.POINT_LIGHT ?
                <AccordionTemplate title={"Attenuation"} type={"flex"}>
                    <Range
                        accentColor={"red"}
                        incrementPercentage={.01}
                        minValue={.0001}
                        precision={2}
                        value={state.attenuation.x}
                        onFinish={(v) => {
                            props.submit([v, state.attenuation.y, state.attenuation.z], "attenuation")
                            setState(({
                                ...state,
                                attenuation:  {
                                    ...state.attenuation,
                                    x: v
                                }
                            }))
                        }}
                        handleChange={e => props.selected.attenuation[0] = e}/>
                    <Range
                        accentColor={"green"}
                        incrementPercentage={.01}
                        minValue={.01}
                        precision={2}
                        value={state.attenuation.y}
                        onFinish={(v) => {
                            props.submit([state.attenuation.x, v, state.attenuation.z], "attenuation")
                            setState(({
                                ...state,
                                attenuation:  {
                                    ...state.attenuation,
                                    y: v
                                }
                            }))
                        }}
                        handleChange={e => props.selected.attenuation[1] = e}/>
                    <Range
                        accentColor={"blue"}
                        incrementPercentage={.01}
                        minValue={.01}
                        precision={2}
                        value={state.attenuation.z}
                        onFinish={(v) => {
                            props.submit([state.attenuation.x, state.attenuation.y, v], "attenuation")
                            setState(({
                                ...state,
                                attenuation:  {
                                    ...state.attenuation,
                                    z: v
                                }
                            }))
                        }}
                        handleChange={e => props.selected.attenuation[2] = e}/>

                </AccordionTemplate>
                :
                null
            }

            <AccordionTemplate title={"View planes"} type={"grid"}>
                <Range
                    accentColor={"red"}
                    value={state.zFar}
                    label={"Far"}
                    precision={3}
                    incrementPercentage={.01}
                    onFinish={(v) => {
                        props.submit(v, "zFar")
                        setState(({
                            ...state,
                            zFar: v
                        }))
                    }}
                    handleChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                zFar: e
                            }
                        })
                    }}
                />
                <Range
                    accentColor={"green"}
                    value={state.zNear}
                    label={"Near"}
                    precision={3}
                    incrementPercentage={.01}
                    onFinish={(v) => {
                        props.submit(v, "zNear")
                        setState(({
                            ...state,
                            zNear: v
                        }))
                    }}
                    handleChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                zNear: e
                            }
                        })
                    }}/>
            </AccordionTemplate>
            <AccordionTemplate title={"Intensity & color"}>
                <ColorPicker
                    value={state.color}
                    submit={color => {
                        const split = color.match(/[\d.]+/g)
                        const [r, g, b] = split.map(v => parseFloat(v))
                        setState({
                            ...state,
                            color: {r: r, g: g, b: b}
                        })
                        props.submit([r, g, b], "color")
                    }}/>
                <Range
                    label={"Intensity"}
                    accentColor={"red"}
                    value={state.intensity}
                    minValue={.0001}
                    incrementPercentage={.01}
                    precision={4}
                    onFinish={(v) => { 
                        props.submit(v, "intensity")
                        setState(({
                            ...state,
                            intensity: v
                        }))
                    }}
                    handleChange={e => props.selected.intensity = e}/>
            </AccordionTemplate>
            <AccordionTemplate title={"Shadows"} type={"grid"}>

                <Checkbox
                    noMargin={true}
                    label={"Casts shadows"}
                    width={"100%"}
                    height={"25px"}
                    checked={state.shadowMap}
                    handleCheck={() => {
                        setState({...state, shadowMap: !state.shadowMap})
                        props.submit(!state.shadowMap, "shadowMap")
                    }}/>
                {props.type === COMPONENTS.DIRECTIONAL_LIGHT || props.type === COMPONENTS.SKYLIGHT ?
                    <Range
                        label={"Size"}
                        accentColor={"green"}
                        value={state.size}
                        minValue={1}
                        incrementPercentage={1}
                        precision={0}
                        onFinish={(v) => {
                            props.submit(v, "size")
                            setState(({
                                ...state,
                                size: v
                            }))
                        }}
                        handleChange={e => {
                            props.selected.size = e
                        }}/>
                    :
                    null
                }

            </AccordionTemplate>


        </>

    )
}

Lights.propTypes = {
    entityID: PropTypes.string,
    type: PropTypes.oneOf([COMPONENTS.POINT_LIGHT, COMPONENTS.DIRECTIONAL_LIGHT ]),
    selected: PropTypes.object,
    submit: PropTypes.func,    
}
