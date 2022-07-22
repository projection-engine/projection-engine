import React, {useEffect, useState} from "react"
import ReactDOM from "react-dom"
import "../global/global.css"
import LocalizationProvider from "../global/LocalizationProvider" 
import {ThemeProvider, useAlert} from "@f-ui/core"
import Editor from "./Editor"
import Shortcuts from "./components/shortcuts/Shortcuts"
import useGlobalOptions from "../components/hooks/useGlobalOptions"
import useLoader from "../components/loader/useLoader"
import useDirectState from "../components/hooks/useDirectState"
import SETTINGS from "./static/misc/SETTINGS"
import loadGlobalLocalization from "../global/loadGlobalLocalization"
import ROUTES from "../../public/static/ROUTES"
import FileSystem from "./libs/FileSystem"
import Initializer from "./libs/Initializer"
import FRAME_EVENTS from "../../public/static/FRAME_EVENTS"

const {ipcRenderer} = window.require("electron")
const DARK = "dark"

function Root() {
    const [localization, setLocalization] = useState("en")
    const [project, setProject] = useState()
    const [events, setEvents] = useState({})
    const [settings, , pushBlock] = useDirectState(SETTINGS)
    const global = useGlobalOptions()
    const loader = useLoader(global.dark, global.accentColor)
    useAlert(true)

    useEffect(() => {
        loadGlobalLocalization()
        ipcRenderer.send(ROUTES.LOAD_PROJECT)
        ipcRenderer.on(ROUTES.PAGE_PROPS, (ev, data) => {
            const fs = new FileSystem(data.package.id)
            Initializer(fs, loader.pushEvent)
            setProject(data.package)
            setEvents({
                ...data,
                closeEvent: FRAME_EVENTS.CLOSE,
                minimizeEvent: FRAME_EVENTS.MINIMIZE,
                maximizeEvent: FRAME_EVENTS.MAXIMIZE
            })
        })
        // document.body.addEventListener("keydown", e => {
        //     e.preventDefault()
        // })
    }, [])

    return (
        <LocalizationProvider.Provider value={{localization, setLocalization}}>
            <ThemeProvider
                language={localization}
                theme={DARK}
                accentColor={global.accentColor}
                className={"wrapper"}
            >
                {project != null ?
                    <Editor
                        settings={settings}
                        load={loader}
                        pushSettingsBlock={pushBlock}
                        frameEvents={events}
                        id={project.id}
                        meta={project.meta}
                    /> : null}
                <Shortcuts settings={settings}/>
            </ThemeProvider>
        </LocalizationProvider.Provider>
    )
}

ReactDOM.render(
    <Root/>,
    document.getElementById("root")
)
