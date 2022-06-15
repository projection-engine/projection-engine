import PropTypes from "prop-types"
import styles from "../styles/Forms.module.css"
import {Button, Icon} from "@f-ui/core"
import React, {useMemo} from "react"
import Selector from "../../../../components/selector/Selector"

export default function Entity(props) {
    return (
        <>

            <Selector
                type={"script"}
                selected={undefined}
                handleChange={d => {
                    if (d)
                        props.submit(d.registryID, true)
                }}>
                <div className={[styles.inline, styles.add].join(" ")}>
                    <Icon>add</Icon>
                    Add new component
                </div>
            </Selector>
  
            <label className={styles.label}>
                Linked scripts
            </label>
            {props.selected.scripts.length > 0 ? props.selected.scripts.map(s => (
                <React.Fragment key={s}>
                    <ScriptRow selected={s} scripts={props.quickAccess.scripts} submit={props.submit}/>
                </React.Fragment>
            ))
                :
                <div className={styles.empty}>
                    <Icon styles={{fontSize: "30px"}}>folder</Icon>
                No linked blueprints
                </div>
            }
        </>
    )
}

Entity.propTypes = {
    quickAccess: PropTypes.object,
    selected: PropTypes.object,
    submit: PropTypes.func
}

function ScriptRow(props) {
    const {scripts, selected, submit} = props
    const found = useMemo(() => scripts.find(s => s.registryID === selected), [scripts])
    if (found)
        return (
            <div className={styles.scriptsList}>
                <label className={styles.overflow}>
                    {found.name}
                </label>
                <Button styles={{"--pj-accent-color": "#ff5555"}} className={styles.buttonScriptsList} onClick={() => submit(selected, false)}>
                    <Icon styles={{fontSize: "1.1rem"}}>close</Icon>
                </Button>
            </div>
        )
    return null
}
ScriptRow.propTypes={
    scripts:PropTypes.array,
    selected: PropTypes.string,
    submit: PropTypes.func
}