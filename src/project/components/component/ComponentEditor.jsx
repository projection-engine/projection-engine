import PropTypes from "prop-types"
import styles from "./styles/Scene.module.css"
import React, {useContext, useMemo, useState} from "react"
import useForm from "./hooks/useForm"
import {Icon} from "@f-ui/core"
import FormTabs from "./components/FormTabs"
import getComponentInfo from "./utils/getComponentInfo"
import EngineProvider from "../../context/EngineProvider"
import Header from "../../../components/view/components/Header"
import useLocalization from "../../../global/useLocalization"

export default function ComponentEditor(props) {
    const  [engine] = useContext(EngineProvider)
    const [currentTab, setCurrentTab] = useState("-2")
    const currentForm = useForm(engine, currentTab)
    const tabs = useMemo(() => {
        if (engine.selectedEntity) {
            const components = Object.keys(engine.selectedEntity.components)
            if (components[currentTab] === undefined && currentTab > 0) {
                setCurrentTab(components.length - 1)
                return []
            }
            return components.map(c => getComponentInfo(c)).filter(c => Object.keys(c).length > 0)
        }
        return []
    }, [engine.selected, currentTab])
    const translate = useLocalization("PROJECT", "COMPONENT_EDITOR")
    return (
        <>
            <Header {...props} icon={"category"} title={engine.selectedEntity ? engine.selectedEntity.name : translate("TITLE")}/>
            {props.hidden ?
                null
                :
                <div className={styles.content}>
                    <FormTabs
                        translate={translate}
                        tabs={tabs}
                        entity={engine.selectedEntity}
                        currentTab={currentTab}
                        setCurrentTab={setCurrentTab}
                    />
                    <div style={{width: "100%", overflowX: "hidden"}}>
                        {engine.executingAnimation || currentForm.open ? null : (
                            <div className={styles.header} style={{justifyContent: "flex-start"}}>
                                <Icon styles={{fontSize: "1rem"}}>
                                    {currentTab === "-2" ? "image" : null}
                                    {currentTab === "-3" ? "videocam" : null}
                                </Icon>
                                <label className={styles.overflow}>
                                    {currentTab === "-2" ? translate("RENDERING"): null}
                                    {currentTab === "-3" ? translate("POST_PROCESSING") : null}
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
            }
        </>
    )
}

ComponentEditor.propTypes={
    orientation: PropTypes.string,
    hidden: PropTypes.bool,
    switchView: PropTypes.func
}