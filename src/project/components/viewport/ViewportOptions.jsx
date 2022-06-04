import React, {useContext, useEffect, useState} from "react"
import PropTypes from "prop-types"
import styles from "./styles/ViewportOptions.module.css"
import SettingsProvider from "../../hooks/SettingsProvider"
import {ENTITY_ACTIONS} from "../../engine/useEngineEssentials"
import {HISTORY_ACTIONS} from "../../hooks/historyReducer"
import ShadingTypes from "./components/ShadingTypes"
import CreateEntity from "./components/CreateEntity"
import VisualSettings from "./components/VisualSettings"
import Extra from "./components/Extra"
import CameraOptions from "./components/CameraOptions"
import TransformationSettings from "./components/TransformationSettings"


export default function ViewportOptions(props) {
    const settingsContext = useContext(SettingsProvider)
    const [fullscreen, setFullscreen] = useState(false)
    const [cameraIsOrthographic, setCameraIsOrthographic] = useState(props.engine?.renderer?.camera?.ortho)

    const handleFullscreen = () => {
        if (!document.fullscreenElement)
            setFullscreen(false)
        else
            setFullscreen(true)
    }
    useEffect(() => {
        document.addEventListener("fullscreenchange", handleFullscreen)
        return () => document.removeEventListener("fullscreenchange", handleFullscreen)
    }, [fullscreen])

    const dispatchEntity = (entity) => {
        props.engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
        props.engine.dispatchChanges({
            type: HISTORY_ACTIONS.PUSHING_DATA,
            payload: [entity]
        })
    }

    return (
        <div style={{display: props.executingAnimation || fullscreen ? "none" : undefined}}>
            {props.minimal ? null :
                <div className={styles.options} style={{display: fullscreen ? "none" : undefined}} draggable={false}>
                    <div style={{justifyContent: "flex-start"}} className={styles.align}>
                        <Extra settingsContext={settingsContext} fullscreen={fullscreen}
                            setFullscreen={setFullscreen} fullscreenID={props.fullscreenID}/>
                        <VisualSettings settingsContext={settingsContext}/>
                        <CreateEntity dispatchEntity={dispatchEntity} engine={props.engine}/>
                    </div>

                    <ShadingTypes settingsContext={settingsContext}/>
                </div>}
            <TransformationSettings settingsContext={settingsContext}/>
            <CameraOptions 
                minimal={props.minimal} 
                id={props.id}
                engine={props.engine}
                setCameraIsOrthographic={setCameraIsOrthographic}
                settingsContext={settingsContext}
                cameraIsOrthographic={cameraIsOrthographic}
            />
        </div>
    )

}
ViewportOptions.propTypes = {
    executingAnimation: PropTypes.bool,
    minimal: PropTypes.bool,
    fullscreenID: PropTypes.string,
    engine: PropTypes.object,
    id: PropTypes.string
}