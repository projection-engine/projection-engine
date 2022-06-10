import React, {useContext, useEffect, useRef, useState} from "react"
import PropTypes from "prop-types"
import styles from "./styles/ViewportOptions.module.css"
import SettingsProvider from "../../hooks/SettingsProvider"
import {ENTITY_ACTIONS} from "../../engine-extension/entityReducer"
import {HISTORY_ACTIONS} from "../../hooks/historyReducer"
import Shading from "./components/Shading"
import Add from "./components/Add"
import Visible from "./components/Visible"
import Gizmo from "./components/Gizmo"
import {Button} from "@f-ui/core"


export default function ViewportOptions(props) {
    const settingsContext = useContext(SettingsProvider)
    const [fullscreen, setFullscreen] = useState(false)

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
    const ref = useRef()

    if(props.executingAnimation || fullscreen )
        return null
    return (
        <>
            <div className={styles.options} ref={ref} style={{display: fullscreen ? "none" : undefined}} draggable={false}>
                <div style={{justifyContent: "flex-start"}} className={styles.align}>

                    <Button className={styles.dropdown} onClick={() =>{
                        if (!fullscreen) {
                            ref.current.parentNode.requestFullscreen()
                                .then(() => setFullscreen(true))
                                .catch()
                        } else
                            document.exitFullscreen()
                                .catch()
                                .finally(() => setFullscreen(false))
                    } }>
                        <span className={"material-icons-round"} style={{fontSize: "1.1rem"}}>fullscreen</span>
                    </Button>

                    <Visible settingsContext={settingsContext}/>
                    <Add dispatchEntity={dispatchEntity} engine={props.engine}/>
                </div>
                <Shading settingsContext={settingsContext}/>
            </div>
            <Gizmo settingsContext={settingsContext}/>
        </>
    )
}
ViewportOptions.propTypes = {
    executingAnimation: PropTypes.bool,
    engine: PropTypes.object
}