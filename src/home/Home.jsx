import {Switcher,} from "@f-ui/core"
import styles from "./styles/Home.module.css"
import React, {useState} from "react"
import Projects from "./components/Projects"
import useProjects from "./hooks/useProjects"
import SideBar from "./components/SideBar"
import IssuesList from "./components/issues/IssuesList"
import AsyncFS from "../project/templates/AsyncFS"
import FileSystem from "../project/utils/files/FileSystem"
import EN from "../static/locale/EN"


const pathResolve = window.require("path")

export default function Home() {
    const {
        projects,
        alert,
        setAlert, refresh,
        load,
        setProjects
    } = useProjects()
    const [open, setOpen] = useState(0)

    return (
        <div className={styles.wrapper}>
            <SideBar open={open} setOpen={setOpen}/>
            <Switcher openChild={open} styles={{width: "100%"}}>
                <Projects
                    alert={alert}
                    deleteProject={async pjID => {
                        setAlert({message: EN.HOME.HOME.DELETE, type: "info"})
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
                        if (res && !error) {
                            const [e] = await AsyncFS.write(pathName, JSON.stringify({
                                ...JSON.parse(res),
                                name: newName
                            }))
                            if (!e)
                                setAlert({
                                    type: "success",
                                    message: EN.HOME.HOME.RENAME
                                })
                            else
                                setAlert({
                                    type: "error",
                                    message:  EN.HOME.HOME.RENAME_ERROR
                                })
                        }
                    }}
                    refresh={() => refresh()}
                    load={load} projects={projects}
                    setProjects={setProjects}/>
                <IssuesList/>
            </Switcher>
        </div>
    )
}

