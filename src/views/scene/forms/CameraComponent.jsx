import PropTypes from "prop-types";
import styles from "../styles/Forms.module.css";
import {Accordion, AccordionSummary, Checkbox, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import React, {useEffect, useState} from "react";
import Range from "../../../components/range/Range";


export default function CameraComponent(props) {

    const [state, setState] = useState({})
    useEffect(() => {
        setState({})
    }, [props.selected])


    return (
        <>

            <Accordion className={styles.fieldset}>
                <AccordionSummary className={styles.summary}>
                    Resolution
                </AccordionSummary>

            </Accordion>


        </>


    )
}

CameraComponent.propTypes = {
    selected: PropTypes.object,
    submit: PropTypes.func,

}
