import React, {useEffect} from "react"
import ReactDOM from "react-dom"
import "../../global/global.css"
import styles from "./styles/Settings.module.css"
import {Button, ThemeProvider} from "@f-ui/core"
import ROUTES from "../../../public/static/ROUTES"
import WINDOWS from "../../../public/static/WINDOWS"
import logo from "../../static/logo.png"
import useLocalization from "../../global/useLocalization"
import useDirectState from "../../components/hooks/useDirectState"
import Frame from "../../components/frame/Frame"
import FRAME_EVENTS from "../../../public/static/FRAME_EVENTS"
import SideBar from "./components/SideBar"
import ResizableBar from "../../components/resizable/ResizableBar"
import CurrentView from "./components/CurrentView"

const {ipcRenderer} = window.require("electron")


function Settings() {
    const translate = useLocalization("SETTINGS", "MAIN")
    const [settings, clean, dispatchBlock] = useDirectState()

    useEffect(() => {
        ipcRenderer.once(WINDOWS.SETTINGS + ROUTES.ON_NEW_WINDOW, (event, data) => {
            console.log(data, event)
        })
    }, [])

    return (
        <ThemeProvider
            language={"en"}
            theme={"dark"}
            className={"wrapper " + styles.wrapper}
        >
            <Frame
                options={[]}
                label={translate("TITLE")}
                pageInfo={{
                    closeEvent: () => {
                        const settingsClone = {}
                        Object.keys(settings).map(k => {
                            settingsClone[k] = settings[k]
                        })
                        ipcRenderer.send(WINDOWS.SETTINGS + ROUTES.CLOSE_NEW_WINDOW, settingsClone)
                    }
                }}
            />
            <div style={{display: "flex", height: "100%", width: "100%"}}>
                <SideBar/>
                <ResizableBar type={"width"}/>
                <CurrentView/>
            </div>
        </ThemeProvider>
    )
}

ReactDOM.render(
    <Settings/>,
    document.getElementById("root")
)
