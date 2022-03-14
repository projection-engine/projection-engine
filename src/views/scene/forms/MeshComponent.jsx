import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {Accordion, AccordionSummary, Checkbox, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import styles from "../styles/Forms.module.css";
import handleDrop from "../../../services/utils/handleDrop";
import Selector from "../../../components/selector/Selector";
import MESH_TYPES from "../../../services/engine/utils/misc/MESH_TYPES";


export default function MeshComponent(props) {
    const [meshType, setMeshType] = useState(props.selected.meshType)
    const [currentMesh, setCurrentMesh] = useState()
    useEffect(() => {
        setCurrentMesh(props.quickAccess.meshes.find(mesh => mesh.registryID === props.selected.meshID))
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

                    <div className={styles.inputs} style={{padding: '4px', marginTop: '4px'}}>
                        <Checkbox checked={meshType === MESH_TYPES.STATIC} handleCheck={() => {
                            const c = meshType === MESH_TYPES.STATIC ? MESH_TYPES.DYNAMIC : MESH_TYPES.STATIC
                            setMeshType(c)
                            props.submit(c, true)
                        }}/>
                        <label className={styles.label}>
                            Static mesh
                        </label>
                    </div>
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
    selected: PropTypes.object
}