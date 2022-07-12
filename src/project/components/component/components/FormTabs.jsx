import styles from "../styles/Tabs.module.css"
import PropTypes from "prop-types"
import React, {useEffect, useMemo, useRef} from "react"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import {Button, Icon, ToolTip} from "@f-ui/core"

export const ENTITY_TAB = "entity"
export default function FormTabs(props) {
    const currentKey = useMemo(() => {
        if (props.entity)
            return Object.keys(props.entity.components)[props.currentTab]
        return undefined
    }, [props.currentTab, props.entity])
    const initialized = useRef(false)
    useEffect(() => {
        if (!props.entity) {
            props.setCurrentTab("-2")
            initialized.current = false
        } else if (!initialized.current && !props.entity.components[COMPONENTS.FOLDER]) {
            props.setCurrentTab("0")
            initialized.current = true
        }
    }, [props.entity])
    return (
        <div className={styles.wrapper}>
            <Button
                className={styles.button}
                variant={props.currentTab === "-2" ? "filled" : undefined}
                onClick={() => props.setCurrentTab("-2")}
            >
                <Icon styles={{fontWeight: "1rem"}}>image</Icon>
                <ToolTip content={"Display"} animation={"0ms"}/>
            </Button>
            <Button
                className={styles.button}
                variant={props.currentTab === "-3" ? "filled" : undefined}
                onClick={() => props.setCurrentTab("-3")}
            >
                <Icon styles={{fontWeight: "1rem"}}>videocam</Icon>
                <ToolTip content={"Editor post-processing"} animation={"0ms"}/>
            </Button>
            {props.entity ? <div className={styles.divider}/> : undefined}
            {props.entity === undefined || props.entity.isFolder ? null :
                <Button
                    variant={props.currentTab === ENTITY_TAB ? "filled" : undefined}
                    className={styles.button}
                    onClick={() => props.setCurrentTab(ENTITY_TAB)}>
                    <Icon styles={{fontWeight: "1rem"}}>terminal</Icon>
                    <ToolTip content={"Scripts"} animationDelay={"0ms"}/>
                </Button>
            }
            {props.tabs.map((t, i) => (
                <React.Fragment key={i + "-component-tab"}>
                    <Button
                        variant={currentKey === t.key ? "filled" : undefined}
                        className={styles.button}
                        onClick={() => props.setCurrentTab(Object.keys(props.entity.components).findIndex(e => e === t.key))}>
                        <Icon styles={{fontWeight: "1rem"}}>{t.icon}</Icon>
                        <ToolTip content={t.label} animationDelay={"0ms"}/>
                    </Button>
                </React.Fragment>

            ))}
        </div>
    )
}

FormTabs.propTypes = {
    tabs: PropTypes.array,
    addComponent: PropTypes.func,

    entity: PropTypes.object,
    currentTab: PropTypes.any,
    setCurrentTab: PropTypes.func
}