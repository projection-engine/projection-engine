import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {Accordion, AccordionSummary, Checkbox} from "@f-ui/core";
import styles from "../styles/Forms.module.css";
import handleDrop from "../../../pages/project/utils/utils/handleDrop";
import Selector from "../../../components/selector/Selector";
import MESH_TYPES from "../../../engine/shared/templates/MESH_TYPES";


export default function MeshComponent(props) {
    const [meshType, setMeshType] = useState(props.selected.meshType)
    const [currentMesh, setCurrentMesh] = useState()
    useEffect(() => {
        setCurrentMesh(props.quickAccess.meshes.find(mesh => mesh.registryID === props.selected.meshID))
    }, [props.quickAccess.meshes, props.selected])

    return (
        <>
            <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}>
                <AccordionSummary className={styles.summary}>
                    Mesh
                </AccordionSummary>

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
            </Accordion>


            <Checkbox
                noMargin={true}
                label={'Static mesh'}
                width={'100%'}
                height={'35px'}

                checked={meshType === MESH_TYPES.STATIC} handleCheck={() => {
                const c = meshType === MESH_TYPES.STATIC ? MESH_TYPES.DYNAMIC : MESH_TYPES.STATIC
                setMeshType(c)
                props.submit(c, true)
            }}/>

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