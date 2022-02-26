import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {Accordion, AccordionSummary, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import styles from "../styles/Forms.module.css";
import MeshInstance from "../../../services/engine/elements/instances/MeshInstance";
import EVENTS from "../../../services/utils/misc/EVENTS";
import handleDrop from "../../../services/utils/handleDrop";
import Selector from "../../../components/selector/Selector";


export default function MeshComponent(props) {

    const [currentMesh, setCurrentMesh] = useState()
    useEffect(() => {
        setCurrentMesh(props.quickAccess.meshes.find(mesh => mesh.registryID === props.selected))
    }, [props.quickAccess.meshes, props.selected])

    return (
        <>
            <Accordion>
                <AccordionSummary className={styles.summary}>
                    Mesh
                </AccordionSummary>
                <div className={styles.wrapper} style={{display: 'grid', padding: '4px', gap: '4px'}}>
                    <Selector
                        selected={currentMesh}
                        type={'mesh'}
                        handleChange={m => {
                            let data = props.engine.meshes.find(mesh => mesh.id === m.registryID)
                            if (!data)
                                handleDrop(m.registryID, props.quickAccess.fileSystem, props.engine, props.setAlert, props.load, true)
                                    .then(() => {
                                        props.submit(m.registryID)
                                    })
                            else {

                                props.submit(m.registryID)
                            }
                        }}/>
                </div>
            </Accordion>


        </>
    )
}

MeshComponent.propTypes = {
    setAlert: PropTypes.func,
    quickAccess: PropTypes.object,

    engine: PropTypes.object,
    load: PropTypes.object,

    submit: PropTypes.func,
    selected: PropTypes.string,
}