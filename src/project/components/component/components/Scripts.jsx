import PropTypes from "prop-types"
import styles from "../styles/Forms.module.css"
import {Button, Icon} from "@f-ui/core"
import React, {useContext, useEffect, useMemo, useRef, useState} from "react"
import Selector from "../../../../components/selector/Selector"
import QuickAccessProvider from "../../../context/QuickAccessProvider"

export default function Scripts(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const [state, setState] = useState([])
    const previousID = useRef()
    useEffect(() => {
        if(previousID.current !== props.entity.id) {
            previousID.current = props.entity.id
            setState([...props.entity.scriptsMap])
        }
    }, [props.entity])
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "center"
        }}>
            <Selector
                type={"script"}
                selected={undefined}
                autoClose={true}
                handleChange={d => {
                    if (d && !state.find(s => s === d.registryID)) {
                        props.entity.scriptsMap.push(d.registryID)
                        setState(prev => {
                            return [...prev, d.registryID]
                        })
                    }else if(state.find(s => s === d.registryID))
                        alert.pushAlert("Script already linked", "info")
                }}
            >
                <div className={[styles.inline, styles.add].join(" ")}>
                    <Icon>add</Icon>
                    Add new component
                </div>
            </Selector>
  
            <label className={styles.label}>
                Linked scripts
            </label>
            {state.length > 0 ? state.map((s, index) => (
                <React.Fragment key={s + "-script-" + index}>
                    <ScriptRow
                        selected={s}
                        scripts={quickAccess.scripts}
                        submit={key => {
                            const newScripts = state.filter(s => s !==key)
                            props.entity.scripts = newScripts
                            setState(newScripts)
                        }}
                    />
                </React.Fragment>
            ))
                :
                <div className={styles.empty}>
                    <Icon styles={{fontSize: "30px"}}>folder</Icon>
                    No linked blueprints
                </div>
            }
        </div>
    )
}

Scripts.propTypes = {
    entity: PropTypes.object
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
                <Button styles={{"--pj-accent-color": "#ff5555"}} className={styles.buttonScriptsList} onClick={() => submit(selected)}>
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