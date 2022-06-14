import React, {useEffect, useState} from "react"
import ReactDOM from "react-dom"
import "../styles/globals.css"
import {ThemeProvider, useAlert} from "@f-ui/core"
import styles from "../styles/App.module.css"
import useGlobalOptions from "../components/hooks/useGlobalOptions"
import useLoader from "../components/loader/useLoader"
import LoaderProvider from "../components/loader/LoaderProvider"
import Project from "./Project"
import useGPU from "./components/viewport/hooks/useGPU"
import GPUContextProvider from "./components/viewport/hooks/GPUContextProvider"
import useSettings from "./hooks/useSettings"
import FRAME_EVENTS from "../../public/FRAME_EVENTS"
import useHotKeysHelper from "./components/shortcuts/hooks/useHotKeysHelper"
import HotKeysProvider from "./components/shortcuts/hooks/HotKeysProvider"

const {ipcRenderer} = window.require("electron")

function EntryPoint() {
    const global = useGlobalOptions()
    const loader = useLoader(global.dark, global.accentColor)
    const [project, setProject] = useState()
    const [events, setEvents] = useState({})
    const [initialized, setInitialized] = useState(false)
    const [settings, clean, pushBlock] = useSettings()
    const gpuContext = useGPU(initialized, settings.resolution, project?.id)
    const hotKeysHook= useHotKeysHelper()

    useEffect(() => {
        ipcRenderer.send("load-page")
        ipcRenderer.on("page-load-props", (ev, data) => {
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
                <LoaderProvider.Provider value={loader}>
                    <GPUContextProvider.Provider value={gpuContext}>
                        {project ? <Project
                            settings={settings}
                            pushSettingsBlock={pushBlock}
                            initialized={initialized}
                            setInitialized={setInitialized}

                            events={{
                                ...events,
                                closeEvent: FRAME_EVENTS.CLOSE,
                                minimizeEvent: FRAME_EVENTS.MINIMIZE,
                                maximizeEvent: FRAME_EVENTS.MAXIMIZE
                            }}
                            id={project.id}
                            meta={project.meta}
                        /> : null}
                    </GPUContextProvider.Provider>
                </LoaderProvider.Provider>
            </HotKeysProvider.Provider>
        </ThemeProvider>)
}


ReactDOM.render(<React.StrictMode>
    <EntryPoint/>
</React.StrictMode>, document.getElementById("root"))
