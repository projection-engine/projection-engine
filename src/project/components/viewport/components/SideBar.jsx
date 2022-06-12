import styles from "../styles/SideBar.module.css"
import React, {useEffect, useMemo, useState} from "react"
import Camera from "./Camera"
import PropTypes from "prop-types"
import {Button} from "@f-ui/core"
import CameraTab from "./CameraTab"
import Transform from "../../scene/components/Transform"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import {updateTransform} from "../../scene/hooks/useForm"
import ViewportTab from "./ViewportTab"

export default function SideBar(props){
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState(-1)
    const {engine} = props

    const selected = useMemo(() => {
        return engine.entities.find(e => !engine.lockedEntity && e.id === engine.selected[0] || engine.lockedEntity === e.id)
    }, [engine.selected, engine.entities, engine.lockedEntity])
    useEffect(() => {
        if(!selected && tab === 2)
            setTab(0)
    }, [selected])


    return (
        <>
            <div className={styles.cameraOptions} style={{right: !open ? undefined : "0"}}>
                <Camera
                    engine={props.engine}
                />
            </div>
            <div style={{display: tab === -1 ? "none" : undefined}} className={styles.content}>
                {tab === 0 ? <CameraTab engine={props.engine}/> : null}
                {tab === 1 ? <ViewportTab engine={props.engine}/> : null}
                {tab === 2 && selected ?
                    <Transform
                        engine={engine} selected={selected.components[COMPONENTS.TRANSFORM]} entityID={selected.id}
                        submitRotation={(axis, data) => updateTransform(axis, data, "rotation", engine, selected.id)}
                        submitScaling={(axis, data) => updateTransform(axis, data, "scaling", engine, selected.id)}
                        submitTranslation={(axis, data) => updateTransform(axis, data, "translation", engine, selected.id)}
                    />
                    : null}
            </div>
            <div className={styles.bar} data-hidden={`${!open}`}>
                <Button onClick={() => {
                    setOpen(!open)
                    setTab(-1)
                }} className={styles.hideButton}>
                    <span className={"material-icons-round"} style={{fontSize: "1.1rem"}}>{open ? "navigate_next" : "chevron_left"}</span>
                </Button>
                <Button 
                    disabled={!engine.selected[0] && !engine.lockedEntity}
                    variant={tab === 2 ? "filled" : undefined}
                    className={styles.button}
                    onClick={() => {
                        if(tab === 2)
                            setTab(-1)
                        else
                            setTab(2)
                    }}
                >
                    <label>
                    Active entity
                    </label>
                </Button>
                <Button
                    variant={tab === 1 ? "filled" : undefined} 
                    className={styles.button}
                    onClick={() => {
                        if(tab === 1)
                            setTab(-1)
                        else
                            setTab(1)
                    }}
                >
                    <label>
                    Viewport
                    </label>
                </Button>
                <Button 
                    variant={tab === 0 ? "filled" : undefined}
                    className={styles.button} 
                    onClick={() => {
                        if(tab === 0)
                            setTab(-1)
                        else
                            setTab(0)
                    }}
                >
                    <label>
                    Camera
                    </label>
                </Button>
            </div>
        </>
        
    )
}
SideBar.propTypes={
    engine: PropTypes.object
}