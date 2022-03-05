import PropTypes from "prop-types";
import styles from '../styles/Forms.module.css'
import {Accordion, AccordionSummary, LoaderProvider} from "@f-ui/core";
import React, {useContext, useEffect, useState} from "react";
import EVENTS from "../../../services/utils/misc/EVENTS";

import Selector from "../../../components/selector/Selector";


export default function MaterialComponent(props) {
    const [currentMaterial, setCurrentMaterial] = useState(undefined)
    const fileSystem = props.quickAccess.fileSystem
    const load = useContext(LoaderProvider)


    useEffect(() => {
        setCurrentMaterial(props.quickAccess.materials.find(i => i.registryID === props.materialID))
    }, [])

    return (
        <Accordion>
            <AccordionSummary className={styles.summary}>
                Material
            </AccordionSummary>
            <div className={styles.formWrapper}>
                <Selector
                    selected={currentMaterial}
                    type={'material'}
                    handleChange={src => {
                        if(src) {
                            load.pushEvent(EVENTS.LOAD_FILE)
                            fileSystem.readRegistryFile(src.registryID)
                                .then(rs => {
                                    if (rs)
                                        fileSystem.readFile(fileSystem.path + '\\assets\\' + rs.path, 'json')
                                            .then(file => {
                                                if (file && file.response) {
                                                    props.submit({
                                                        blob: file.response,
                                                        id: src.registryID,
                                                        name: src.name
                                                    })
                                                    setCurrentMaterial(src)
                                                } else
                                                    props.setAlert({
                                                        type: 'error',
                                                        message: 'Error loading material.'
                                                    })
                                                load.finishEvent(EVENTS.LOAD_FILE)
                                            })
                                    else
                                        load.finishEvent(EVENTS.LOAD_FILE)
                                })
                        }
                        else
                            props.submit()
                    }}/>
            </div>
        </Accordion>

    )
}
MaterialComponent.propTypes = {
    quickAccess: PropTypes.object,
    loadedMaterials: PropTypes.array,
    setAlert: PropTypes.func.isRequired,
    materialID: PropTypes.string,


    submit: PropTypes.func,
    gpu: PropTypes.object
}