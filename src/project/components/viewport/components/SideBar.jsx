import styles from "../styles/SideBar.module.css"
import React, {useState} from "react"
import CameraOptions from "./CameraOptions"
import PropTypes from "prop-types"
import {Button} from "@f-ui/core"

export default function SideBar(props){
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState(-1)
    return (
        <>
            <div className={styles.cameraOptions} style={{right: !open ? undefined : '0'}}>
                <CameraOptions
                    engine={props.engine}
                />
            </div>
            <div style={{display: tab === -1 ? "none" : undefined}} className={styles.content}>
                {tab === 0 ? "Camera" : null}
                {tab === 1 ? "Viewport" : null}
                {tab === 2 ? "Entity" : null}
            </div>
            <div className={styles.bar} data-hidden={`${!open}`}>
                <Button onClick={() => {
                    setOpen(!open)
                    setTab(-1)
                }} className={styles.hideButton}>
                    <span className={"material-icons-round"} style={{fontSize: "1.1rem"}}>{open ? "navigate_next" : "chevron_left"}</span>
                </Button>
                <Button variant={tab === 2 ? "filled" : undefined} className={styles.button} onClick={() => setTab(2)}>
                    <label>
                    Active entity
                    </label>
                </Button>
                <Button variant={tab === 1 ? "filled" : undefined} className={styles.button} onClick={() => setTab(1)}>
                    <label>
                    Viewport
                    </label>
                </Button>
                <Button variant={tab === 0 ? "filled" : undefined} className={styles.button} onClick={() => setTab(0)}>
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