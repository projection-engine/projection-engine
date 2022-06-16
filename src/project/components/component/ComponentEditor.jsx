import PropTypes from "prop-types"
import styles from "./styles/Scene.module.css"
import React, {useContext, useMemo, useState} from "react"
import useForm from "./hooks/useForm"
import QuickAccessProvider from "../../hooks/QuickAccessProvider"
import {Icon} from "@f-ui/core"
import FormTabs from "./components/FormTabs"
import getComponentInfo from "./utils/getComponentInfo"

export default function ComponentEditor(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const [currentTab, setCurrentTab] = useState("-2")
    const currentForm = useForm(
        props.engine,
        quickAccess,
        currentTab
    )

    const tabs = useMemo(() => {
        if (currentForm.selected) {
            const components = Object.keys(currentForm.selected.components)
            if (components[currentTab] === undefined && currentTab > 0) {
                setCurrentTab(components.length - 1)
                return []
            }
            return components.map(c => getComponentInfo(c)).filter(c => Object.keys(c).length > 0)
        }
        return []
    }, [currentForm.selected, currentTab])
    return (
        <div className={styles.content}>
            <FormTabs
                tabs={tabs}
                entity={currentForm.selected}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
            />
            <div style={{width: "100%", overflowX: "hidden"}}>
                {props.engine.executingAnimation || currentForm.open ? null : (
                    <div className={styles.header} style={{justifyContent: "flex-start"}}>
                        <Icon
                            styles={{fontSize: "1rem"}}
                        >
                            {currentTab === "-1" ? "tv" : null}
                            {currentTab === "-2" ? "image" : null}
                            {currentTab === "-3" ? "videocam" : null}
                        </Icon>
                        <label className={styles.overflow}>
                            {currentTab === "-1" ? "Display" : null}
                            {currentTab === "-2" ? "Rendering features" : null}
                            {currentTab === "-3" ? "Editor camera effects" : null}
                        </label>
                    </div>
                )}
                {tabs[currentTab] ? (
                    <div className={styles.header} style={{justifyContent: "flex-start"}}>
                        <Icon styles={{fontSize: "1rem"}}>
                            {tabs[currentTab].icon}
                        </Icon>
                        <label className={styles.overflow}>
                            {tabs[currentTab].label}
                        </label>
                    </div>
                ) : null}
                {currentForm.content}
            </div>
        </div>
    )
}

ComponentEditor.propTypes = {
    engine: PropTypes.object
}