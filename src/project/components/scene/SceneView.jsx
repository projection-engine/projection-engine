import PropTypes from "prop-types"
import styles from "./styles/Scene.module.css"
import React, {useContext, useState} from "react"
import useForm from "./hooks/useForm"
import QuickAccessProvider from "../../hooks/QuickAccessProvider"
import {Button, Icon} from "@f-ui/core"
import ResizableBar from "../../../components/resizable/ResizableBar"
import FormTabs from "./components/FormTabs"
import Hierarchy from "./components/Hierarchy"


export default function SceneView(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const [currentTab, setCurrentTab] = useState("-2")
    const currentForm = useForm(
        props.engine,
        props.executingAnimation,
        quickAccess,
        currentTab
    )

    return (
        <div className={styles.wrapper}>
            <Hierarchy {...props}/>
            <ResizableBar type={"height"}/>
            <div className={styles.wrapperContent}>

                <div className={styles.content}>
                    <FormTabs
                        entity={currentForm.selected}
                        currentTab={currentTab}
                        setCurrentTab={setCurrentTab}
                    />
                    <div style={{width: "100%", overflowX: "hidden"}}>
                        {currentForm.open ? (<div className={styles.header}>
                            <label className={styles.overflow}>{currentForm.name}</label>
                            <Button
                                styles={{minHeight: "25px", minWidth: "25px"}}
                                onClick={() => props.engine.setLockedEntity(props.engine.lockedEntity === currentForm.selected?.id ? undefined : currentForm.selected.id)}
                                className={styles.button}
                                variant={props.engine.lockedEntity === currentForm.selected?.id ? "filled" : undefined}
                            >
                                <Icon styles={{fontSize: "1rem"}}>push_pin</Icon>
                            </Button>
                        </div>) : props.engine.executingAnimation ? null : (
                            <div className={styles.header} style={{justifyContent: "flex-start"}}>
                                <Icon
                                    styles={{fontSize: "1.2rem"}}
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
                        {currentForm.content}
                    </div>
                </div>
            </div>
        </div>
    )
}

SceneView.propTypes = {
    executingAnimation: PropTypes.bool,
    engine: PropTypes.object,
    operationUtils: PropTypes.object
}