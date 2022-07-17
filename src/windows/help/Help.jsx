import React from "react"
import ReactDOM from "react-dom"
import "../../global/global.css"
import {Button, ThemeProvider} from "@f-ui/core"
import ROUTES from "../../../public/static/ROUTES"
import WINDOWS from "../../../public/static/WINDOWS"

const {ipcRenderer} = window.require("electron")
function Help() {

    return (
        <ThemeProvider
            language={"en"}
            theme={"dark"}
            className={"wrapper"}
        >
            <Button onClick={() => {
                ipcRenderer.send(WINDOWS.HELP + ROUTES.CLOSE_NEW_WINDOW)
            }}>
                CLOSE
            </Button>
        </ThemeProvider>
    )
}


ReactDOM.render(
    <React.StrictMode>
        <Help/>
    </React.StrictMode>,
    document.getElementById("root")
)
