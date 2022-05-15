import PropTypes from "prop-types";
import styles from '../styles/Mesh.module.css'
import {Accordion, AccordionSummary, AlertProvider} from "@f-ui/core";

import {useContext, useMemo} from "react";

import QuickAccessProvider from "../../../hooks/QuickAccessProvider";
import MaterialComponent from "../../scene/forms/MaterialComponent";

import {IDS} from "../../../engine-editor/useMinimalEngine";
import TransformComponent from "../../scene/forms/TransformComponent";
import Transformation from "../../../engine/instances/Transformation";

export default function Controls(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const alert = useContext(AlertProvider)
    const selected = useMemo(() => {
        return props.engine.entities.find(e => e.id === IDS.TARGET)
    }, [props.engine.entities])

    if (props.engine.initialized && selected)
        return (
            <div className={styles.controlsWrapper}>
                <MaterialComponent
                    quickAccess={quickAccess}
                    meshes={props.engine.meshes}
                    meshID={selected.components.MeshComponent.meshID}
                    submit={(mat) => {

                    }}
                    setAlert={({message, type}) => alert.pushAlert(message, type)}
                />
                <TransformComponent
                    selected={selected.components.TransformComponent}
                    submitRotation={(axis, data) => Transformation.updateTransform(axis, data, 'rotation',  props.engine, IDS.TARGET)}
                    submitScaling={(axis, data) => Transformation.updateTransform(axis, data, 'scaling',  props.engine, IDS.TARGET)}
                    submitTranslation={(axis, data) => Transformation.updateTransform(axis, data, 'translation',  props.engine, IDS.TARGET)}
                />
                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        Collision
                    </AccordionSummary>
                </Accordion>
                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        Physics body
                    </AccordionSummary>
                </Accordion>


                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        LOD
                    </AccordionSummary>
                </Accordion>
                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        LOD 0
                    </AccordionSummary>
                </Accordion>
                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        LOD 1
                    </AccordionSummary>
                </Accordion>

                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        LOD 2
                    </AccordionSummary>
                </Accordion>
            </div>
        )
    else
        return (
            <div className={styles.controlsWrapper}/>
        )
}

Controls.propTypes = {
    engine: PropTypes.object.isRequired,
    load: PropTypes.object.isRequired
}