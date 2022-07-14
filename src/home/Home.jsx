import React, {useMemo, useState} from "react"
import ReactDOM from "react-dom"
import "../styles/globals.css"
import {Dropdown, DropdownOptions, Icon, Switcher, TextField, ThemeProvider, useAlert} from "@f-ui/core"
import shared from "../styles/App.module.css"
import styles from "./styles/Home.module.css"
import Frame from "../components/frame/Frame"
import EN from "../static/locale/EN"
import FRAME_EVENTS from "../../public/static/FRAME_EVENTS"
import useProjects from "./hooks/useProjects"
import SideBar from "./components/SideBar"
import Create from "./components/Create"
import AsyncFS from "../project/libs/AsyncFS"
import FileSystem from "../project/libs/FileSystem"
import IssuesList from "./components/IssuesList"
import Card from "./components/Card"
import Headers from "./components/Headers"

const pathResolve = window.require("path")

function Home() {
    const {projects, setProjects} = useProjects()
    const [open, setOpen] = useState(0)
    const [searchString, setSearchString] = useState("")
    const projectsToShow = useMemo(() => {
        return projects
            .filter(p => p.meta.name?.toLowerCase().includes(searchString.toLowerCase()))
    }, [searchString, projects])

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
                    <div className={styles.wrapperProjects}>
                        <div className={styles.titleWrapper}>
                            <div className={styles.title}>
                                <label>{EN.HOME.PROJECTS.PROJECTS}</label>
                                <TextField
                                    handleChange={e => setSearchString(e)}
                                    placeholder={EN.HOME.PROJECTS.SEARCH}
                                    value={searchString}
                                    height={"25px"}
                                />
                            </div>
                            <Dropdown
                                className={styles.button}
                                variant={"filled"} hideArrow={true}
                                wrapperClassname={styles.createModal}
                            >
                                <Icon styles={{fontSize: "1.1rem"}}>add</Icon>
                                {EN.HOME.PROJECTS.CREATE}
                                <DropdownOptions>
                                    <Create setProjects={setProjects}/>
                                </DropdownOptions>
                            </Dropdown>
                        </div>
                        <Headers/>
                        {projectsToShow.length === 0 ?
                            <div className={styles.emptyWrapper}>
                                <Icon styles={{fontSize: "100px"}}>folder</Icon>
                                {EN.HOME.PROJECTS.EMPTY}
                            </div>
                            :
                            <div className={styles.content}>
                                {projectsToShow.map((p, i) => (
                                    <React.Fragment key={p.id}>
                                        <Card
                                            data={p} index={i}
                                            onRename={async newName => {
                                                const pathName = pathResolve.resolve(localStorage.getItem("basePath") + "projects" + FileSystem.sep + p.id + FileSystem.sep + ".meta")
                                                const [error, res] = await AsyncFS.read(pathName)
                                                if (res && !error)
                                                    await AsyncFS.write(pathName, JSON.stringify({
                                                        ...JSON.parse(res),
                                                        name: newName
                                                    }))
                                            }}
                                            onDelete={async () => {
                                                await AsyncFS.rm(
                                                    pathResolve.resolve(localStorage.getItem("basePath") + "projects" + FileSystem.sep + p.id),
                                                    {recursive: true, force: true})
                                                setProjects(prev => prev.filter(e => e.id !== p.id))
                                            }}
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                        }
                    </div>
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
