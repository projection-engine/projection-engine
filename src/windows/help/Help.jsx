import React from "react"
import ReactDOM from "react-dom"
import "../../global/global.css"
import styles from "./Styles.module.css"
import {Button, ThemeProvider} from "@f-ui/core"
import ROUTES from "../../../public/static/ROUTES"
import WINDOWS from "../../../public/static/WINDOWS"
import logo from "../../static/logo.png"
import useLocalization from "../../global/useLocalization"

const {ipcRenderer} = window.require("electron")



function Help() {
    const translate = useLocalization("HELP", "MAIN")
    return (
        <ThemeProvider
            language={"en"}
            theme={"dark"}
            className={"wrapper " + styles.wrapper}
        >
            <div className={styles.logoWrapper}>
                <img draggable={false} alt={"logo"} src={logo} className={styles.image}/>
                {translate("TITLE")}
            </div>
            <article className={styles.article} dangerouslySetInnerHTML={{__html: translate("BODY")}}/>
            <Button
                onClick={() => {
                    ipcRenderer.send(WINDOWS.HELP + ROUTES.CLOSE_NEW_WINDOW)
                }}
                className={styles.closeButton}
            >
                {translate("CLOSE")}
            </Button>
        </ThemeProvider>
    )
}


ReactDOM.render(
    <Help/>,
    document.getElementById("root")
)
