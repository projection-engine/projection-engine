import PropTypes from "prop-types";
import styles from "../styles/Forms.module.css";
import {Accordion, AccordionSummary} from "@f-ui/core";
import React, {useEffect, useState} from "react";
import Transformation from "../../../services/engine/utils/workers/Transformation";
import Range from "../../../components/range/Range";


const toDeg =  180/Math.PI, toRad =  Math.PI / 180
export default function CameraComponent(props) {
    const [state, setState] = useState({})
    const getNewState = () => {
        return {
            fov: Math.round(props.selected.fov * toDeg),
            aspectRatio: props.selected.aspectRatio,
            zNear: props.selected.zNear,
            zFar: props.selected.zFar
        }
    }
    useEffect(() => {
        setState(getNewState())
    }, [props])

    return (
        <>
            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    FOV
                </AccordionSummary>
                <Range
                    metric={'angle'}
                    accentColor={'red'}
                    value={state.fov}
                    precision={1}
                    incrementPercentage={.1}
                    onFinish={() => {
                        props.submit(state.fov * toRad, 'fov')
                    }}
                    handleChange={e => setState({...state, fov: e})}
                />
            </Accordion>
            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Aspect Ratio
                </AccordionSummary>
                <Range
                    value={state.aspectRatio}
                    precision={3}
                    incrementPercentage={.01}
                    onFinish={() => {
                        props.submit(state.aspectRatio, 'aspectRatio')
                    }}
                    handleChange={e => setState({...state, aspectRatio: e})}
                />
            </Accordion>
            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Near plane
                </AccordionSummary>
                <Range
                    value={state.zNear}
                    precision={1}
                    incrementPercentage={.1}

                    onFinish={() => {
                        props.submit(state.zNear, 'zNear')
                    }}
                    handleChange={e => setState({...state, zNear: e})}
                />
            </Accordion>
            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Far plane
                </AccordionSummary>
                <Range
                    value={state.zFar}
                    precision={0}
                    incrementPercentage={1}
                    onFinish={() => {
                        props.submit(state.zFar, 'zFar')
                    }}
                    handleChange={e => setState({...state, zFar: e})}
                />
            </Accordion>

        </>


    )
}

CameraComponent.propTypes = {
    selected: PropTypes.object,
    submit: PropTypes.func,
}
