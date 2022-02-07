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
            <div className={styles.inputs}>
                <div className={styles.label}>Translation</div>
                <Range
                    accentColor={'red'}
                    label={'x'}
                    value={state.xT}
                    onFinish={() => props.submitTranslation('x', state.xT)}
                    handleChange={e => {
                        props.selected.translation = [parseFloat(e), props.selected.translation[1], props.selected.translation[2]]
                        setState({...state, xT: parseFloat(e)})
                    }}
                />
                <Range
                    accentColor={'#00ff00'}
                    label={'y'}
                    value={state.yT}
                    onFinish={() => props.submitTranslation('y', state.yT)}
                    handleChange={e => {
                        props.selected.translation = [props.selected.translation[0], parseFloat(e), props.selected.translation[2]]
                        setState({...state, yT: parseFloat(e)})

                    }}
                />
                <Range
                    accentColor={'#0095ff'}
                    label={'z'}
                    value={state.zT}
                    onFinish={() => props.submitTranslation('z', state.zT)}
                    handleChange={e => {
                        props.selected.translation = [props.selected.translation[0], props.selected.translation[1], parseFloat(e)]
                        setState({...state, zT: parseFloat(e)})
                    }}
                />
            </div>


            <div className={styles.inputs}>
                <div className={styles.label}>Scale</div>
                <Range
                    accentColor={'red'}
                    label={'x'}
                    value={state.xS}
                    onFinish={() => props.submitScaling('x', state.xS)}
                    handleChange={e => {
                        if (parseFloat(e) > 0.1) {
                            props.selected.scaling = [parseFloat(e), props.selected.scaling[1], props.selected.scaling[2]]
                            setState({...state, xS: parseFloat(e)})
                        }
                    }}
                />
                <Range
                    accentColor={'#00ff00'}
                    label={'y'}
                    value={state.yS}
                    onFinish={() => props.submitScaling('y', state.yS)}
                    handleChange={e => {
                        if (parseFloat(e) > 0.1) {
                            props.selected.scaling = [props.selected.scaling[0], parseFloat(e), props.selected.scaling[2]]
                            setState({...state, yS: parseFloat(e)})
                        }
                    }}/>
                <Range
                    accentColor={'#0095ff'}
                    label={'z'}
                    value={state.zS}
                    onFinish={() => props.submitScaling('z', state.zS)}
                    handleChange={e => {
                        if (parseFloat(e) > 0.1) {
                            props.selected.scaling = [props.selected.scaling[0], props.selected.scaling[1], parseFloat(e)]
                            setState({...state, zS: parseFloat(e)})
                        }
                    }}
                />
            </div>
            <div className={styles.inputs}>
                <div className={styles.label}>Rotation</div>
                <Range
                    accentColor={'red'}
                    label={'x'}
                    value={state.xR}
                    onFinish={() => props.submitRotation('x', state.xR* Math.PI / 180)}
                    handleChange={e => {
                        props.selected.rotation = [parseFloat(e) * Math.PI / 180, props.selected.rotation[1], props.selected.rotation[2]]

                        setState({...state, xR: parseFloat(e)})
                    }}/>
                <Range

                    accentColor={'#00ff00'}
                    label={'y'}
                    value={state.yR}
                    onFinish={() => props.submitRotation('y', state.yR* Math.PI / 180)}
                    handleChange={e => {
                        props.selected.rotation = [props.selected.rotation[0], parseFloat(e) * Math.PI / 180, props.selected.rotation[2]]
                        setState({...state, yR: parseFloat(e)})
                    }}/>
                <Range
                    accentColor={'#0095ff'}

                    label={'z'}
                    value={state.zR}
                    onFinish={() => props.submitRotation('z', state.zR* Math.PI / 180)}
                    handleChange={e => {
                        props.selected.rotation = [props.selected.rotation[0], props.selected.rotation[1], parseFloat(e) * Math.PI / 180]
                        setState({...state, zR: parseFloat(e)})
                    }}
                />
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