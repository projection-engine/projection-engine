import React, {useState} from "react"
import ReactDOM from "react-dom"
import "../styles/globals.css"
import {Switcher, ThemeProvider, useAlert} from "@f-ui/core"
import shared from "../styles/App.module.css"
import styles from "./styles/Home.module.css"
import useGlobalOptions from "../components/hooks/useGlobalOptions"
import useLoader from "../components/loader/useLoader"
import LoaderProvider from "../components/loader/LoaderProvider"
import Frame from "../components/frame/Frame"
import EN from "../static/locale/EN"
import FRAME_EVENTS from "../../public/FRAME_EVENTS"
import useProjects from "./hooks/useProjects"
import SideBar from "./components/SideBar"
import Projects from "./components/Projects"
import AsyncFS from "../project/templates/AsyncFS"
import FileSystem from "../project/utils/files/FileSystem"
import IssuesList from "./components/issues/IssuesList"

const pathResolve = window.require("path")

function Home() {
    const global = useGlobalOptions()
    const loader = useLoader(global.dark, global.accentColor)
    const {
        projects,
        refresh,
        load,
        setProjects
    } = useProjects()
    const [open, setOpen] = useState(0)
    useAlert(true)
    return (
        <ThemeProvider
            language={"en"}
            theme={"dark"}
            className={[shared.wrapper, shared.dark].join(" ")}
        >
            <Frame
                options={[]}
                label={EN.HOME.ENTRY_POINT.TITLE}
                hasLogo={false}
                pageInfo={{
                    closeEvent: FRAME_EVENTS.CLOSE,
                    minimizeEvent: FRAME_EVENTS.MINIMIZE,
                    maximizeEvent: FRAME_EVENTS.MAXIMIZE
                }}/>
            <LoaderProvider.Provider value={loader}>
                <div className={styles.wrapper}>
                    <SideBar open={open} setOpen={setOpen}/>
                    <Switcher openChild={open} styles={{width: "100%"}}>
                        <Projects
 
                            deleteProject={async pjID => {
                                await AsyncFS.rm(
                                    pathResolve.resolve(localStorage.getItem("basePath") + "projects" + FileSystem.sep + pjID),
                                    {recursive: true, force: true}
                                )
                                setProjects(prev => {
                                    return prev.filter(e => e.id !== pjID)
                                })
                            }}
                            renameProject={async (newName, projectID) => {
                                const pathName = pathResolve.resolve(localStorage.getItem("basePath") + "projects" + FileSystem.sep + projectID + FileSystem.sep + ".meta")
                                const [error, res] = await AsyncFS.read(pathName)
                                if (res && !error) 
                                    await AsyncFS.write(pathName, JSON.stringify({
                                        ...JSON.parse(res),
                                        name: newName
                                    }))
                            }}
                            refresh={() => refresh()}
                            load={load} projects={projects}
                            setProjects={setProjects}/>
                        <IssuesList/>
                    </Switcher>
                </div>
            </LoaderProvider.Provider>
        </ThemeProvider>
    )
}


ReactDOM.render(
    <React.StrictMode>
        <Home/>
    </React.StrictMode>,
    document.getElementById("root")
)
