import styles from "../styles/Tabs.module.css"
import PropTypes from "prop-types"
import React, {useEffect, useMemo, useRef} from "react"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import {Button, ToolTip} from "@f-ui/core"
import getComponentInfo from "../utils/getComponentInfo"

export const ENTITY_TAB = "entity"
export default function FormTabs(props) {

    const tabs = useMemo(() => {
        if (props.entity) {
            const components = Object.keys(props.entity.components)
            if (components[props.currentTab] === undefined && props.currentTab > 0) {
                props.setCurrentTab(components.length - 1)
                return []
            }
            return components.map(c => getComponentInfo(c)).filter(c => Object.keys(c).length > 0)
        }
        return []
    }, [props.entity, props.currentTab])

    const currentKey = useMemo(() => {
        if (props.entity)
            return Object.keys(props.entity.components)[props.currentTab]
        else
            return undefined
    }, [props.currentTab, props.entity?.id])
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
                <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>image</span>
                <ToolTip content={"Display"} animation={"0ms"}/>
            </Button>
            <Button
                className={styles.button}
                variant={props.currentTab === "-3" ? "filled" : undefined}
                onClick={() => props.setCurrentTab("-3")}
            >
                <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>videocam</span>
                <ToolTip content={"Editor camera"} animation={"0ms"}/>
            </Button>

            <Button
                variant={props.currentTab === "-1" ? "filled" : undefined}
                className={styles.button}
                onClick={() => props.setCurrentTab("-1")}
            >
                <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>tv</span>
                <ToolTip content={"Graphics"} animation={"0ms"}/>
            </Button>
            {props.entity ? <div className={styles.divider}/> : undefined}
            {props.entity === undefined || props.entity.isFolder ? null :
                <Button
                    variant={props.currentTab === ENTITY_TAB ? "filled" : undefined}
                    className={styles.button}
                    onClick={() => props.setCurrentTab(ENTITY_TAB)}>
                    <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>code</span>
                    <ToolTip content={"Entity"} animation={"0ms"}/>
                </Button>
            }
            {tabs.map((t, i) => (
                <React.Fragment key={i + "-component-tab"}>
                    <Button
                        variant={currentKey === t.key ? "filled" : undefined}
                        className={styles.button}
                        onClick={() => props.setCurrentTab(Object.keys(props.entity.components).findIndex(e => e === t.key))}>
                        {t.icon}
                        <ToolTip content={t.label} animation={"0ms"}/>
                    </Button>
                </React.Fragment>

            ))}
        </div>
    )
}

FormTabs.propTypes = {
    addComponent: PropTypes.func,

    entity: PropTypes.object,
    currentTab: PropTypes.any,
    setCurrentTab: PropTypes.func
}