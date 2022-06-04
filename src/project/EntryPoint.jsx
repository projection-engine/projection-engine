import React, {useEffect, useState} from "react"
import ReactDOM from "react-dom"
import "../styles/globals.css"
import {Fabric} from "@f-ui/core"
import styles from "../styles/App.module.css"
import ThemeProvider from "./hooks/ThemeProvider"
import useGlobalOptions from "./hooks/useGlobalOptions"
import useLoader from "../components/loader/useLoader"
import LoaderProvider from "../components/loader/LoaderProvider"
import Project from "./Project"
import useGPU from "./components/viewport/hooks/useGPU"
import GPUContextProvider from "./components/viewport/hooks/GPUContextProvider"
import useSettings from "./hooks/useSettings"
import HotKeysProvider from "../components/hot-keys/HotKeysProvider"
import useHotKeysHelper from "../components/hot-keys/useHotKeysHelper"

const {ipcRenderer} = window.require("electron")

function EntryPoint() {
    const global = useGlobalOptions()
    const loader = useLoader(global.dark, global.accentColor)
    const [project, setProject] = useState()
    const [events, setEvents] = useState({})
    const [initialized, setInitialized] = useState(false)
    const settings = useSettings()
    const gpuContext = useGPU(initialized, settings.resolution, project?.id)
    const hotKeysHook= useHotKeysHelper()

    useEffect(() => {
        ipcRenderer.send("load-page")
        ipcRenderer.on("page-load-props", (ev, data) => {
            setProject(data.package)
            setEvents(data)
        })
    }, [])
    useEffect(() => {
        document.body.classList.remove(global.dark ? "light" : "dark")
        document.body.classList.add(global.dark ? "dark" : "light")
    }, [global.dark])

    return (
        <Fabric
            language={"en"}
            theme={"dark"}
            accentColor={global.accentColor}
            className={styles.wrapper}
        >
            <HotKeysProvider.Provider value={hotKeysHook}>
                <LoaderProvider.Provider value={loader}>
                    <ThemeProvider.Provider value={{
                        ...global, themeClass: global.dark ? styles.dark : styles.light
                    }}>
                        <GPUContextProvider.Provider value={gpuContext}>
                            {project ? <Project
                                settings={settings}
                                initialized={initialized}
                                setInitialized={setInitialized}
                                events={events}
                                id={project.id}
                                meta={project.meta}
                            /> : null}
                        </GPUContextProvider.Provider>
                    </ThemeProvider.Provider>
                </LoaderProvider.Provider>
            </HotKeysProvider.Provider>
        </Fabric>)
}


ReactDOM.render(<React.StrictMode>
    <EntryPoint/>
</React.StrictMode>, document.getElementById("root"))
