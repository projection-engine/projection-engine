import React, {useContext, useEffect, useRef, useState} from "react"
import PropTypes from "prop-types"
import styles from "./styles/ViewportOptions.module.css"
import SettingsProvider from "../../providers/SettingsProvider"
import {ENTITY_ACTIONS} from "../../engine-extension/entityReducer"
import {HISTORY_ACTIONS} from "../../hooks/historyReducer"
import Shading from "./components/Shading"
import Add from "./components/Add"
import Visible from "./components/Visible"
import {Button, Icon} from "@f-ui/core"


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

    if(fullscreen)
        return null
    return (
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
                    <Icon styles={{fontSize: "1.1rem"}}>fullscreen</Icon>
                </Button>

                <Visible settingsContext={settingsContext}/>
                <Add dispatchEntity={dispatchEntity} engine={props.engine}/>
            </div>
            <Shading/>
        </div>
    )
}
ViewportOptions.propTypes = {
    engine: PropTypes.object
}