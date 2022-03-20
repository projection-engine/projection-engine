import PropTypes from "prop-types";
import React, {useContext, useEffect, useState} from "react";
import styles from "../styles/Forms.module.css";
import {Accordion, AccordionSummary} from "@f-ui/core";
import Range from "../../../components/range/Range";
import {mat4, quat, vec4} from "gl-matrix";
import SettingsProvider from "../../../services/hooks/SettingsProvider";
import ROTATION_TYPES from "../../../services/engine/utils/misc/ROTATION_TYPES";


const toDeg = 57.2957795131
export default function TransformComponent(props) {
    const settings = useContext(SettingsProvider)
    const getNewState = () => {
        return {
            xT: props.selected.translation[0],
            yT: props.selected.translation[1],
            zT: props.selected.translation[2],

            xS: props.selected.scaling[0],
            yS: props.selected.scaling[1],
            zS: props.selected.scaling[2],

            xR: props.selected.rotation[0] * 180 / Math.PI,
            yR: props.selected.rotation[1] * 180 / Math.PI,
            zR: props.selected.rotation[2] * 180 / Math.PI,

        }
    }
    const [state, setState] = useState({})


    useEffect(() => {
        console.log(props.selected)
        setState(getNewState())
    }, [props.selected])

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

    return (
        <>
            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Translation
                </AccordionSummary>

                <div className={styles.inputs}>
                    <Range
                        metric={'m'}
                        accentColor={'red'}
                        label={'x'}
                        value={state.xT}
                        precision={3}
                        incrementPercentage={.01}
                        onFinish={() => props.submitTranslation('x', state.xT)}
                        handleChange={e => {
                            translate([parseFloat(e), state.yT, state.zT])
                            // props.selected.translation =
                            // setState({...state, xT: parseFloat(e)})
                        }}
                    />
                    <Range
                        metric={'m'}
                        accentColor={'#00ff00'}
                        label={'y'}
                        precision={3}
                        incrementPercentage={.01}
                        value={state.yT}
                        onFinish={() => props.submitTranslation('y', state.yT)}
                        handleChange={e => {
                            translate([state.xT, parseFloat(e), state.zT])
                            // props.selected.translation =
                            // setState({...state, yT: parseFloat(e)})

                        }}
                    />
                    <Range
                        metric={'m'}
                        accentColor={'#0095ff'}
                        label={'z'}
                        precision={3}
                        incrementPercentage={.01}
                        value={state.zT}
                        onFinish={() => props.submitTranslation('z', state.zT)}
                        handleChange={e => {
                            translate([state.xT, state.yT, parseFloat(e)])
                            // props.selected.translation = [state.xT, state.yT, parseFloat(e)]
                            // setState({...state, zT: parseFloat(e)})
                        }}
                    />
                </div>

            </Accordion>
            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Scale
                </AccordionSummary>
                <div className={styles.inputs}>
                    <Range
                        accentColor={'red'}
                        label={'x'}
                        value={state.xS}
                        minValue={0.001}
                        precision={3}
                        incrementPercentage={.01}
                        onFinish={() => props.submitScaling('x', state.xS)}
                        handleChange={e => {

                            props.selected.scaling = [e, props.selected.scaling[1], props.selected.scaling[2]]
                            setState({...state, xS: e})

                        }}
                    />
                    <Range
                        accentColor={'#00ff00'}
                        label={'y'}
                        value={state.yS}
                        minValue={0.001}
                        precision={3}
                        incrementPercentage={.01}
                        onFinish={() => props.submitScaling('y', state.yS)}
                        handleChange={e => {

                            props.selected.scaling = [props.selected.scaling[0], e, props.selected.scaling[2]]
                            setState({...state, yS: e})

                        }}/>
                    <Range
                        accentColor={'#0095ff'}
                        label={'z'}
                        value={state.zS}
                        minValue={0.001}
                        precision={3}
                        incrementPercentage={.01}
                        onFinish={() => props.submitScaling('z', state.zS)}
                        handleChange={e => {

                            props.selected.scaling = [props.selected.scaling[0], props.selected.scaling[1], e]
                            setState({...state, zS: e})

                        }}
                    />
                </div>
            </Accordion>
            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Rotation
                </AccordionSummary>
                <div className={styles.inputs}>
                    <Range
                        accentColor={'red'}
                        label={'x'}
                        metric={'angle'}
                        value={state.xR}
                        onFinish={() => props.submitRotation('x', state.xR * Math.PI / 180)}
                        handleChange={e => {
                            props.selected.rotation = [parseFloat(e) * Math.PI / 180, props.selected.rotation[1], props.selected.rotation[2]]

                            setState({...state, xR: parseFloat(e)})
                        }}/>
                    <Range
                        metric={'angle'}
                        accentColor={'#00ff00'}
                        label={'y'}
                        value={state.yR}
                        onFinish={() => props.submitRotation('y', state.yR * Math.PI / 180)}
                        handleChange={e => {
                            props.selected.rotation = [props.selected.rotation[0], parseFloat(e) * Math.PI / 180, props.selected.rotation[2]]
                            setState({...state, yR: parseFloat(e)})
                        }}/>
                    <Range
                        accentColor={'#0095ff'}
                        metric={'angle'}
                        label={'z'}
                        value={state.zR}
                        onFinish={() => props.submitRotation('z', state.zR * Math.PI / 180)}
                        handleChange={e => {
                            props.selected.rotation = [props.selected.rotation[0], props.selected.rotation[1], parseFloat(e) * Math.PI / 180]
                            setState({...state, zR: parseFloat(e)})
                        }}
                    />
                </div>

            </Accordion>
        </>
    )
}

TransformComponent.propTypes = {
    selected: PropTypes.object,
    submitRotation: PropTypes.func,
    submitTranslation: PropTypes.func,
    submitScaling: PropTypes.func
}