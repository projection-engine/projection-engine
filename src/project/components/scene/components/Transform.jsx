import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import Range from "../../../../components/range/Range";
import Transformation from "../../../engine/instances/Transformation";
import {HISTORY_ACTIONS} from "../../../hooks/historyReducer";
import COMPONENTS from "../../../engine/templates/COMPONENTS";
import AccordionTemplate from "../../../../components/templates/AccordionTemplate";

export default function Transform(props) {
    const [state, setState] = useState({})
    const getNewState = () => {
        const euler = props.selected.rotationUpdated ? props.selected.rotation : Transformation.getEuler(props.selected.rotationQuat)
        return {
            xT: props.selected.translation[0],
            yT: props.selected.translation[1],
            zT: props.selected.translation[2],

            xS: props.selected.scaling[0],
            yS: props.selected.scaling[1],
            zS: props.selected.scaling[2],

            xR: euler[0] * 180 / Math.PI,
            yR: euler[1] * 180 / Math.PI,
            zR: euler[2] * 180 / Math.PI,

        }
    }
    useEffect(() => {
        setState(getNewState())
    }, [props])

    const [hasChanged, setHasChanged] = useState(false)
    const translate = (newValue) => {
        let t = newValue
        props.selected.translation = t
        setState({
            ...state,
            xT: t[0],
            yT: t[1],
            zT: t[2],
        })
    }
    const saveVersion = () => {
        if (!hasChanged) {
            setHasChanged(true)
            props.engine.dispatchChanges({
                type: HISTORY_ACTIONS.SAVE_COMPONENT_STATE,
                payload: {
                    key: COMPONENTS.TRANSFORM,
                    entityID: props.entityID,
                    component: props.selected
                }
            })
        }
    }
    return (
        <>
            <AccordionTemplate type={'flex'} title={'Translation'}>
                <Range
                    metric={'m'}
                    accentColor={'red'}
                    label={'x'}
                    value={state.xT}
                    precision={3}
                    incrementPercentage={.01}

                    onFinish={(v) => {
                        setHasChanged(false)
                        saveVersion()
                        props.submitTranslation('x', v)
                    }}
                    handleChange={e => {
                        translate([parseFloat(e), state.yT, state.zT])
                    }}
                />
                <Range
                    metric={'m'}
                    accentColor={'#00ff00'}
                    label={'y'}
                    precision={3}
                    incrementPercentage={.01}
                    value={state.yT}
                    onFinish={(v) => {
                        setHasChanged(false)
                        saveVersion()
                        props.submitTranslation('y', v)
                    }}
                    handleChange={e => {
                        translate([state.xT, parseFloat(e), state.zT])
                    }}
                />
                <Range
                    metric={'m'}
                    accentColor={'#0095ff'}
                    label={'z'}
                    precision={3}
                    incrementPercentage={.01}
                    value={state.zT}
                    onFinish={(v) => {
                        setHasChanged(false)
                        saveVersion()
                        props.submitTranslation('z', v)
                    }}
                    handleChange={e => {
                        translate([state.xT, state.yT, parseFloat(e)])
                    }}
                />
            </AccordionTemplate>
            <AccordionTemplate title={'Scale'} type={'flex'}>
                <Range
                    disabled={props.selected.lockedScaling}
                    accentColor={'red'}
                    label={'x'}
                    value={state.xS}
                    minValue={0.001}
                    precision={3}
                    incrementPercentage={.01}
                    onFinish={(v) => {
                        setHasChanged(false)
                        saveVersion()
                        props.submitScaling('x', v)
                    }}
                    handleChange={e => {
                        props.selected.scaling = [e, props.selected.scaling[1], props.selected.scaling[2]]
                        setState({...state, xS: e})

                    }}
                />
                <Range
                    disabled={props.selected.lockedScaling}
                    accentColor={'#00ff00'}
                    label={'y'}
                    value={state.yS}
                    minValue={0.001}
                    precision={3}
                    incrementPercentage={.01}
                    onFinish={(v) => {
                        setHasChanged(false)
                        saveVersion()
                        props.submitScaling('y', v)
                    }}
                    handleChange={e => {
                        props.selected.scaling = [props.selected.scaling[0], e, props.selected.scaling[2]]
                        setState({...state, yS: e})

                    }}/>
                <Range
                    disabled={props.selected.lockedScaling}
                    accentColor={'#0095ff'}
                    label={'z'}
                    value={state.zS}
                    minValue={0.001}
                    precision={3}
                    incrementPercentage={.01}
                    onFinish={(v) => {
                        setHasChanged(false)
                        saveVersion()
                        props.submitScaling('z', v)
                    }}
                    handleChange={e => {
                        props.selected.scaling = [props.selected.scaling[0], props.selected.scaling[1], e]
                        setState({...state, zS: e})

                    }}
                />
            </AccordionTemplate>
            <AccordionTemplate title={'Rotation'} type={'flex'}>
                <Range
                    disabled={props.selected.lockedRotation}
                    accentColor={'red'}
                    label={'x'}
                    metric={'angle'}
                    value={state.xR}
                    onFinish={(v) => {
                        setHasChanged(false)
                        saveVersion()
                        props.submitRotation('x', v * Math.PI / 180)
                    }}
                    handleChange={e => {
                        props.selected.rotation = [parseFloat(e) * Math.PI / 180, props.selected.rotation[1], props.selected.rotation[2]]
                        setState({...state, xR: parseFloat(e)})
                    }}/>
                <Range
                    disabled={props.selected.lockedRotation}
                    metric={'angle'}
                    accentColor={'#00ff00'}
                    label={'y'}
                    value={state.yR}
                    onFinish={(v) => {
                        setHasChanged(false)
                        saveVersion()
                        props.submitRotation('y', v * Math.PI / 180)
                    }}
                    handleChange={e => {
                        props.selected.rotation = [props.selected.rotation[0], parseFloat(e) * Math.PI / 180, props.selected.rotation[2]]
                        setState({...state, yR: parseFloat(e)})
                    }}/>
                <Range
                    accentColor={'#0095ff'}
                    disabled={props.selected.lockedRotation}
                    metric={'angle'}
                    label={'z'}
                    value={state.zR}
                    onFinish={(v) => {
                        setHasChanged(false)
                        saveVersion()
                        props.submitRotation('z', v * Math.PI / 180)
                    }}
                    handleChange={e => {
                        props.selected.rotation = [props.selected.rotation[0], props.selected.rotation[1], parseFloat(e) * Math.PI / 180]
                        setState({...state, zR: parseFloat(e)})
                    }}
                />
            </AccordionTemplate>
        </>
    )
}

Transform.propTypes = {
    engine: PropTypes.object,
    entityID: PropTypes.string,

    selected: PropTypes.object,
    submitRotation: PropTypes.func,
    submitTranslation: PropTypes.func,
    submitScaling: PropTypes.func
}