import PropTypes from "prop-types";
import styles from "../styles/Forms.module.css";
import {Button} from "@f-ui/core";
import React, {useMemo} from "react";
import AccordionTemplate from "../../../components/accordion/AccordionTemplate";
import Selector from "../../../components/selector/Selector";

export default function ScriptComponent(props) {
    return (
        <>
            <AccordionTemplate title={'Link blueprint'}>
                <Selector
                    type={'script'}
                    selected={undefined}
                    handleChange={d => {
                        if (d)
                            props.submit(d.registryID, true)
                    }}/>
            </AccordionTemplate>
            <label className={styles.label}>
                Linked scripts
            </label>
            {props.selected.scripts.length > 0 ? props.selected.scripts.map(s => (
                <React.Fragment key={s}>
                    <Script selected={s} scripts={props.quickAccess.scripts} submit={props.submit}/>
                </React.Fragment>
            ))
                :
            <div className={styles.empty}>
                <span style={{fontSize: '30px'}} className={'material-icons-round'}>folder</span>
                No linked blueprints
            </div>
            }
        </>
    )
}

ScriptComponent.propTypes = {
    quickAccess: PropTypes.object,
    selected: PropTypes.object,
    submit: PropTypes.func
}

function Script({scripts, selected, submit}) {
    const found = useMemo(() => {

        return scripts.find(s => s.registryID === selected)
    }, [scripts])

    if (found)
        return (
            <div className={styles.scriptsList}>
                <label className={styles.overflow}>
                    {found.name}
                </label>
                <Button styles={{'--fabric-accent-color': '#ff5555'}} className={styles.buttonScriptsList} onClick={() => submit(selected, false)}>
                    <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>close</span>
                </Button>
            </div>
        )
    return null
}