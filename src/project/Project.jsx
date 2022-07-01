import React, {useEffect, useState} from "react"
import ReactDOM from "react-dom"
import "../styles/globals.css"
import {ThemeProvider, useAlert} from "@f-ui/core"
import styles from "../styles/App.module.css"
import useGlobalOptions from "../components/hooks/useGlobalOptions"
import useLoader from "../components/loader/useLoader"
import Editor from "./Editor"
import FRAME_EVENTS from "../../public/static/FRAME_EVENTS"
import useHotKeysHelper from "./components/shortcuts/hooks/useHotKeysHelper"
import HotKeysProvider from "./components/shortcuts/hooks/HotKeysProvider"
import useQuickAccess from "./hooks/useQuickAccess"
import QuickAccessProvider from "./providers/QuickAccessProvider"
import FileSystem from "./utils/files/FileSystem"
import insertMethods from "../static/insertMethods"
import useDirectState from "../components/hooks/useDirectState"
import SETTINGS from "./templates/SETTINGS"
import ROUTES from "../../public/static/ROUTES"

const {ipcRenderer} = window.require("electron")

function Project() {
    const global = useGlobalOptions()
    const loader = useLoader(global.dark, global.accentColor)

    const [project, setProject] = useState()
    const [refresh, quickAccess] = useQuickAccess(project?.id)
    const [events, setEvents] = useState({})
    const [settings,, pushBlock] = useDirectState(SETTINGS)
    const hotKeysHook= useHotKeysHelper()

    useEffect(() => {
        ipcRenderer.send(ROUTES.LOAD_PROJECT)
        ipcRenderer.on(ROUTES.PAGE_PROPS, (ev, data) => {
            const fs =  new FileSystem(data.package.id)
            fs.refresh = refresh
            insertMethods(fs, loader.pushEvent)

            setProject(data.package)
            setEvents(data)
        })
        document.body.classList.add(styles.dark)
    }, [])
    useAlert(true)

    return (
        <ThemeProvider
            language={"en"}
            theme={"dark"}
            accentColor={global.accentColor}
            className={styles.wrapper}
        >
            <HotKeysProvider.Provider value={hotKeysHook}>
                <QuickAccessProvider.Provider value={quickAccess}> 
                    {project? <Editor
                        settings={settings}
                        load={loader}
                        pushSettingsBlock={pushBlock}

                        events={{
                            ...events,
                            closeEvent: FRAME_EVENTS.CLOSE,
                            minimizeEvent: FRAME_EVENTS.MINIMIZE,
                            maximizeEvent: FRAME_EVENTS.MAXIMIZE
                        }}
                        quickAccess={quickAccess}
                        id={project.id}
                        meta={project.meta}
                    /> : null} 
                </QuickAccessProvider.Provider>
            </HotKeysProvider.Provider>
        </ThemeProvider>)
}


ReactDOM.render(<React.StrictMode>
    <Project/>
</React.StrictMode>, document.getElementById("root"))
