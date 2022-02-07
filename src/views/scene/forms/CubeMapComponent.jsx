import PropTypes from "prop-types";
import styles from "../styles/Forms.module.css";
import {Accordion, AccordionSummary} from "@f-ui/core";
import React, {useEffect, useState} from "react";
import Range from "../../../components/range/Range";


export default function CubeMapComponent(props) {
    const getNewState = () => {
        return {
            placement: {
                x: props.selected.position[0],
                y: props.selected.position[1],
                z: props.selected.position[2]
            },
            resolution: props.selected.resolution,
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
                    handleChange={e => onChange(parseFloat(e), values[0])}/>
                <Range
                    accentColor={'green'}
                    label={labels[1]}
                    value={state[key][values[1]]}
                    handleChange={e => onChange(parseFloat(e), values[1])}/>
                <Range
                    accentColor={'blue'}
                    label={labels[2]}
                    value={state[key][values[2]]}
                    handleChange={e => onChange(parseFloat(e), values[2])}/>
            </>
        )
    }

    return (

        <Accordion className={styles.fieldset}>
            <AccordionSummary className={styles.summary}>
                Cubemap reflection
            </AccordionSummary>
            <div className={styles.inputs}>
                <div className={styles.label}>Position</div>
                {getInputs(
                    'placement',
                    ['x', 'y', 'z'],
                    (e, field) => {
                        props.submitPlacement(field, e)
                        setState(prev => {
                            return {
                                ...prev, placement: {
                                    ...prev.placement,
                                    [field]: e
                                }
                            }
                        })
                    },
                    ['x', 'y', 'z']
                )}
            </div>
        </Accordion>

    )
}

CubeMapComponent.propTypes = {
    quickAccess: PropTypes.object,
    database: PropTypes.object,

    selected: PropTypes.object,

    submitData: PropTypes.func,
    submitPlacement: PropTypes.func,

}
