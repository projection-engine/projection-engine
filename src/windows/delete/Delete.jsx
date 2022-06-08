import React, {useEffect, useState} from "react"
import ReactDOM from "react-dom"
import "../../styles/globals.css"
import {Fabric} from "@f-ui/core"
import styles from "../../styles/App.module.css"
import Frame from "../../components/frame/Frame"
import FRAME_EVENTS from "../../../public/FRAME_EVENTS"

function Delete() {
    useEffect(() => {
        document.body.classList.add(styles.dark)
    }, [])

    return (
        <Fabric
            language={"en"}
            theme={"dark"}
            className={styles.wrapper}
        >
            <Frame 
                label={"Editor shortcuts"}
                options={[]}
                pageInfo={{
                    closeEvent: FRAME_EVENTS.CLOSE_SHORTCUTS,
                    minimizeEvent: FRAME_EVENTS.MINIMIZE_SHORTCUTS,
                    maximizeEvent: FRAME_EVENTS.MAXIMIZE_SHORTCUTS
                }}
            />
        </Fabric>
    )
}


ReactDOM.render(
    <React.StrictMode>
        <Delete/>
    </React.StrictMode>,
    document.getElementById("root")
)
