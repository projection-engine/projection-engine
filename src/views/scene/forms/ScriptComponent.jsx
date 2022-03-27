import PropTypes from "prop-types";
import styles from '../styles/Forms.module.css'
import {Accordion, AccordionSummary, LoaderProvider} from "@f-ui/core";
import React, {useContext, useEffect, useState} from "react";
import EVENTS from "../../../services/utils/misc/EVENTS";

import Selector from "../../../components/selector/Selector";


export default function ScriptComponent(props) {
    const [currentScript, setCurrentScript] = useState(undefined)
    const fileSystem = props.quickAccess.fileSystem
    const load = useContext(LoaderProvider)

    useEffect(() => {
        setCurrentScript(props.quickAccess.scripts.find(i => i.registryID === props.selected.registryID))
    }, [props.selected])

    return (
        <>
            <Accordion>
                <AccordionSummary className={styles.summary}>
                    Flow Script
                </AccordionSummary>
                <div className={styles.formWrapper}>
                    <Selector
                        selected={currentScript}
                        type={'script'}
                        handleChange={src => {
                            if (src) {
                                load.pushEvent(EVENTS.LOAD_FILE)

                                fileSystem.readRegistryFile(src.registryID)
                                    .then(rs => {

                                        if (rs)
                                            fileSystem.readFile(fileSystem.path + '\\assets\\' + rs.path, 'json')
                                                .then(file => {

                                                    if (file) {
                                                        props.submit({
                                                            blob: file,
                                                            id: src.registryID,
                                                            name: src.name
                                                        })
                                                        setCurrentScript(src)
                                                    } else
                                                        props.setAlert({
                                                            type: 'error',
                                                            message: 'Error loading script.'
                                                        })
                                                    load.finishEvent(EVENTS.LOAD_FILE)
                                                })
                                        else
                                            load.finishEvent(EVENTS.LOAD_FILE)
                                    })
                            } else
                                props.submit()
                        }}/>
                </div>
            </Accordion>
        </>

    )
}
ScriptComponent.propTypes = {
    quickAccess: PropTypes.object,
    selected: PropTypes.object,
    setAlert: PropTypes.func,
    submit: PropTypes.func,

}