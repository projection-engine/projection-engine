import React from "react"
import ReactDOM from "react-dom"
import "../../global/global.css"
import {ThemeProvider} from "@f-ui/core"
import Frame from "../../components/frame/Frame"
import FRAME_EVENTS from "../../../public/static/FRAME_EVENTS"

function Delete() {

    return (
        <ThemeProvider
            language={"en"}
            theme={"dark"}
            className={"wrapper"}
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
        </ThemeProvider>
    )
}


ReactDOM.render(
    <React.StrictMode>
        <Delete/>
    </React.StrictMode>,
    document.getElementById("root")
)
