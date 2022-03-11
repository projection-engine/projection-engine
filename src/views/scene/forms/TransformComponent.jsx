import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import styles from "../styles/Forms.module.css";
import {Accordion, AccordionSummary} from "@f-ui/core";
import Range from "../../../components/range/Range";


export default function TransformComponent(props) {
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
            zR: props.selected.rotation[2] * 180 / Math.PI
        }
    }
    const [state, setState] = useState({})


    useEffect(() => {
        setState(getNewState())
    }, [props.selected])


    return (
        <Accordion className={styles.fieldset}>
            <AccordionSummary className={styles.summary}>
                Transformation
            </AccordionSummary>
            <div className={styles.inputsColumn}>
                <div className={styles.label} style={{marginBottom: '4px'}}>Translation</div>
                <div className={styles.inputs} style={{padding: 0}}>
                    <Range
                        metric={'m'}
                        accentColor={'red'}
                        label={'x'}
                        value={state.xT}
                        precision={3}
                        incrementPercentage={.01}
                        onFinish={() => props.submitTranslation('x', state.xT)}
                        handleChange={e => {
                            props.selected.translation = [parseFloat(e), props.selected.translation[1], props.selected.translation[2]]
                            setState({...state, xT: parseFloat(e)})
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
                            props.selected.translation = [props.selected.translation[0], parseFloat(e), props.selected.translation[2]]
                            setState({...state, yT: parseFloat(e)})

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
                            props.selected.translation = [props.selected.translation[0], props.selected.translation[1], parseFloat(e)]
                            setState({...state, zT: parseFloat(e)})
                        }}
                    />
                </div>
            </div>
            <div className={styles.inputsColumn}>
                <div className={styles.label} style={{marginBottom: '4px'}}>Scale</div>
                <div className={styles.inputs} style={{padding: 0}}>
                    <Range
                        accentColor={'red'}
                        label={'x'}
                        value={state.xS}
                        minValue={0.00001}
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
                        minValue={0.00001}
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
                        minValue={0.00001}
                        precision={3}
                        incrementPercentage={.01}
                        onFinish={() => props.submitScaling('z', state.zS)}
                        handleChange={e => {

                                props.selected.scaling = [props.selected.scaling[0], props.selected.scaling[1], e]
                                setState({...state, zS: e})

                        }}
                    />
                </div>
            </div>
            <div className={styles.inputsColumn} style={{marginBottom: '4px'}}>
                <div className={styles.label} style={{marginBottom: '4px'}}>Rotation</div>
                <div className={styles.inputs} style={{padding: 0}}>
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
            </div>
        </Accordion>
    )
}

TransformComponent.propTypes = {
    selected: PropTypes.object,
    submitRotation: PropTypes.func,
    submitTranslation: PropTypes.func,
    submitScaling: PropTypes.func
}