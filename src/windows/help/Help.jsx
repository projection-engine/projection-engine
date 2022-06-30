import React, {useEffect} from "react"
import ReactDOM from "react-dom"
import "../../styles/globals.css"
import {Button, ThemeProvider} from "@f-ui/core"
import styles from "../../styles/App.module.css"
import ROUTES from "../../../public/static/ROUTES"
import WINDOWS from "../../../public/static/WINDOWS"

const {ipcRenderer} = window.require("electron")
function Help() {
    useEffect(() => {
        document.body.classList.add(styles.dark)
    }, [])

    return (
        <ThemeProvider
            language={"en"}
            theme={"dark"}
            className={styles.wrapper}
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
