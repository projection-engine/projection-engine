import React, {useContext, useEffect, useState} from "react"
import {ThemeProvider, useAlert} from "@f-ui/core"
import useGlobalOptions from "../components/hooks/useGlobalOptions"
import useLoader from "../components/loader/useLoader"
import Editor from "./Editor"
import FRAME_EVENTS from "../../public/static/FRAME_EVENTS"
import useQuickAccess from "./hooks/useQuickAccess"
import QuickAccessProvider from "./context/QuickAccessProvider"
import FileSystem from "./libs/FileSystem"
import WindowInitializer from "./libs/windowInitializer"
import useDirectState from "../components/hooks/useDirectState"
import SETTINGS from "./static/misc/SETTINGS"
import ROUTES from "../../public/static/ROUTES"
import Shortcuts from "./components/shortcuts/Shortcuts"
import loadGlobalLocalization from "../global/loadGlobalLocalization"
import LocalizationProvider from "../global/LocalizationProvider"

const {ipcRenderer} = window.require("electron")
const DARK = "dark"

export default function Project() {
    const global = useGlobalOptions()
    const loader = useLoader(global.dark, global.accentColor)

    const [project, setProject] = useState()
    const [refresh, quickAccess] = useQuickAccess(project?.id)
    const [events, setEvents] = useState({})
    const [settings, , pushBlock] = useDirectState(SETTINGS)

    useEffect(() => {
        loadGlobalLocalization()
        ipcRenderer.send(ROUTES.LOAD_PROJECT)
        ipcRenderer.on(ROUTES.PAGE_PROPS, (ev, data) => {
            const fs = new FileSystem(data.package.id)
            fs.refresh = refresh
            WindowInitializer(fs, loader.pushEvent)

            setProject(data.package)
            setEvents(data)
        })
        // document.body.addEventListener("keydown", e => {
        //     e.preventDefault()
        // })
    }, [])
    useAlert(true)
    const {localization} = useContext(LocalizationProvider)

    return (
        <ThemeProvider
            language={localization}
            theme={DARK}
            accentColor={global.accentColor}
            className={"wrapper"}
        >
            <QuickAccessProvider.Provider value={quickAccess}>
                {project ?
                    <Editor
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
                <Shortcuts/>
            </QuickAccessProvider.Provider>
        </ThemeProvider>
    )
}