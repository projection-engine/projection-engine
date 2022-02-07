import PropTypes from "prop-types";
import styles from '../styles/Mesh.module.css'
import {Accordion, AccordionSummary} from "@f-ui/core";

import {useContext} from "react";
import DatabaseProvider from "../../../components/db/DatabaseProvider";
import QuickAccessProvider from "../../../components/db/QuickAccessProvider";
import MaterialComponent from "../../scene/forms/MaterialComponent";

export default function Controls(props) {
    const database = useContext(DatabaseProvider)
    const quickAccess = useContext(QuickAccessProvider)

    if (props.engine.initialized)

        return (
            <div className={styles.controlsWrapper}>
                <MaterialComponent
                    setAlert={() => null}
                    selected={props.engine.entities[1]}
                    gpu={props.engine.gpu}
                    database={database}
                    submit={() => null}
                    quickAccess={quickAccess}
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
    engine: PropTypes.object.isRequired
}