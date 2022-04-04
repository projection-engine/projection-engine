import PropTypes from "prop-types";
import React, {useContext, useEffect, useState} from "react";
import styles from "../styles/Forms.module.css";
import {Accordion, AccordionSummary} from "@f-ui/core";
import Range from "../../../components/range/Range";
import SettingsProvider from "../../../services/hooks/SettingsProvider";
import Transformation from "../../../services/engine/utils/workers/Transformation";
import {HISTORY_ACTIONS} from "../../../services/utils/historyReducer";
import cloneClass from "../../../services/utils/misc/cloneClass";
import COMPONENTS from "../../../services/engine/templates/COMPONENTS";

export default function TransformComponent(props) {
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
    const [state, setState] = useState({})
    const [hasChanged, setHasChanged] = useState(false)

    useEffect(() => {

        setState(getNewState())
    }, [props])

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

                        onFinish={() => {
                            setHasChanged(false)
                            props.submitTranslation('x', state.xT)
                        }}
                        handleChange={e => {
                            saveVersion()
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
                        onFinish={() => {
                            setHasChanged(false)
                            props.submitTranslation('y', state.yT)
                        }}
                        handleChange={e => {
                            saveVersion()
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
                        onFinish={() => {
                            setHasChanged(false)
                            props.submitTranslation('z', state.zT)
                        }}
                        handleChange={e => {
                            saveVersion()
                            translate([state.xT, state.yT, parseFloat(e)])
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
                        disabled={props.selected.lockedScaling}
                        accentColor={'red'}
                        label={'x'}
                        value={state.xS}
                        minValue={0.001}
                        precision={3}
                        incrementPercentage={.01}
                        onFinish={() => {
                            setHasChanged(false)
                            props.submitScaling('x', state.xS)
                        }}
                        handleChange={e => {
                            saveVersion()
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
                        onFinish={() => {
                            setHasChanged(false)
                            props.submitScaling('y', state.yS)
                        }}
                        handleChange={e => {
                            saveVersion()
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
                        onFinish={() => {
                            setHasChanged(false)
                            props.submitScaling('z', state.zS)
                        }}
                        handleChange={e => {
                            saveVersion()
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
                        disabled={props.selected.lockedRotation}
                        accentColor={'red'}
                        label={'x'}
                        metric={'angle'}
                        value={state.xR}
                        onFinish={() => {
                            setHasChanged(false)
                            props.submitRotation('x', state.xR * Math.PI / 180)
                        }}
                        handleChange={e => {
                            saveVersion()
                            props.selected.rotation = [parseFloat(e) * Math.PI / 180, props.selected.rotation[1], props.selected.rotation[2]]
                            setState({...state, xR: parseFloat(e)})
                        }}/>
                    <Range
                        disabled={props.selected.lockedRotation}
                        metric={'angle'}
                        accentColor={'#00ff00'}
                        label={'y'}
                        value={state.yR}
                        onFinish={() => {
                            setHasChanged(false)
                            props.submitRotation('y', state.yR * Math.PI / 180)
                        }}
                        handleChange={e => {
                            saveVersion()

                            props.selected.rotation = [props.selected.rotation[0], parseFloat(e) * Math.PI / 180, props.selected.rotation[2]]
                            setState({...state, yR: parseFloat(e)})
                        }}/>
                    <Range
                        accentColor={'#0095ff'}
                        disabled={props.selected.lockedRotation}
                        metric={'angle'}
                        label={'z'}
                        value={state.zR}
                        onFinish={() => {
                            setHasChanged(false)
                            props.submitRotation('z', state.zR * Math.PI / 180)
                        }}
                        handleChange={e => {
                            saveVersion()

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
    engine: PropTypes.object,
    entityID: PropTypes.string,

    selected: PropTypes.object,
    submitRotation: PropTypes.func,
    submitTranslation: PropTypes.func,
    submitScaling: PropTypes.func
}