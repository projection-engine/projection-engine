import styles from "../styles/Tabs.module.css"
import PropTypes from "prop-types"
import React, {useEffect, useMemo, useRef} from "react"
import {Button, Icon, ToolTip} from "@f-ui/core"

export const ENTITY_TAB = "entity"
export default function FormTabs(props) {
    const {translate, entity, currentTab, setCurrentTab, tabs} = props
    const currentKey = useMemo(() => {
        if (entity)
            return Object.keys(entity.components)[currentTab]
        return undefined
    }, [currentTab, entity])
    const initialized = useRef(false)
    useEffect(() => {
        if (!entity) {
            setCurrentTab("-2")
            initialized.current = false
        } else if (!initialized.current && !entity.isFolder) {
            setCurrentTab("0")
            initialized.current = true
        }
    }, [entity])

    return (
        <div className={styles.wrapper}>
            <Button
                className={styles.button}
                variant={currentTab === "-2" ? "filled" : undefined}
                onClick={() => setCurrentTab("-2")}
            >
                <Icon styles={{fontWeight: "1rem"}}>image</Icon>
                <ToolTip content={translate("RENDERING")} animation={"0ms"}/>
            </Button>
            <Button
                className={styles.button}
                variant={currentTab === "-3" ? "filled" : undefined}
                onClick={() => setCurrentTab("-3")}
            >
                <Icon styles={{fontWeight: "1rem"}}>videocam</Icon>
                <ToolTip content={translate("POST_PROCESSING")} animation={"0ms"}/>
            </Button>
            {entity !== undefined && !entity.isFolder  ? <div className={styles.divider}/> : undefined}
            {entity === undefined || entity.isFolder ? null :
                <Button
                    variant={currentTab === ENTITY_TAB ? "filled" : undefined}
                    className={styles.button}
                    onClick={() => setCurrentTab(ENTITY_TAB)}>
                    <Icon styles={{fontWeight: "1rem"}}>terminal</Icon>
                    <ToolTip content={translate("SCRIPTS")} animationDelay={"0ms"}/>
                </Button>
            }
            {tabs.map((t, i) => (
                <React.Fragment key={i + "-component-tab"}>
                    <Button
                        variant={currentKey === t.key ? "filled" : undefined}
                        className={styles.button}
                        onClick={() => setCurrentTab(Object.keys(entity.components).findIndex(e => e === t.key))}>
                        <Icon styles={{fontWeight: "1rem"}}>{t.icon}</Icon>
                        <ToolTip content={t.label} animationDelay={"0ms"}/>
                    </Button>
                </React.Fragment>

            ))}
        </div>
    )
}

FormTabs.propTypes = {
    translate: PropTypes.func,
    tabs: PropTypes.array,
    addComponent: PropTypes.func,

    entity: PropTypes.object,
    currentTab: PropTypes.any,
    setCurrentTab: PropTypes.func
}