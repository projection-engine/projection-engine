import React, {useState} from "react"
import ReactDOM from "react-dom"
import "../styles/globals.css"
import {Switcher, ThemeProvider, useAlert} from "@f-ui/core"
import shared from "../styles/App.module.css"
import styles from "./styles/Home.module.css"
import Frame from "../components/frame/Frame"
import EN from "../static/locale/EN"
import FRAME_EVENTS from "../../public/static/FRAME_EVENTS"
import useProjects from "./hooks/useProjects"
import SideBar from "./components/SideBar"
import Projects from "./components/Projects"
import AsyncFS from "../project/templates/AsyncFS"
import FileSystem from "../project/utils/files/FileSystem"
import IssuesList from "./components/issues/IssuesList"

const pathResolve = window.require("path")

function Home() {
    const {
        projects,
        refresh,
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
                        projects={projects}
                        setProjects={setProjects}/>
                    <IssuesList/>
                </Switcher>
            </div>
        </ThemeProvider>
    )
}


ReactDOM.render(
    <React.StrictMode>
        <Home/>
    </React.StrictMode>,
    document.getElementById("root")
)
