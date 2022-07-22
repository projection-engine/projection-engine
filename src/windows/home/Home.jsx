import React, {useContext} from "react"
import {Dropdown, DropdownOptions, Icon, ThemeProvider} from "@f-ui/core"
import styles from "./styles/Home.module.css"
import Frame from "../../components/frame/Frame"
import FRAME_EVENTS from "../../../public/static/FRAME_EVENTS"
import useProjects from "./hooks/useProjects"
import Create from "./components/Create"
import AsyncFS from "../../project/libs/AsyncFS"
import FileSystem from "../../project/libs/FileSystem"
import Card from "./components/Card"
import LocalizationProvider from "../../global/LocalizationProvider"
import useLocalization from "../../global/useLocalization"
import Search from "../../components/search/Search"
import Recent from "./components/Recent"
import ROUTES from "../../../public/static/ROUTES"

const pathResolve = window.require("path")
const {ipcRenderer} = window.require("electron")

export default function Home() {
    const {searchString, setSearchString, projectsToShow, setProjects} = useProjects()
    const {localization} = useContext(LocalizationProvider)
    const translate = useLocalization("HOME", "HOME")

    function openProject(p) {
        ipcRenderer.send(ROUTES.SWITCH_MAIN_WINDOW, {
            windowID: p.id,
            data: p,
            hasMain: false
        })
    }

    return (
        <ThemeProvider
            language={localization}
            theme={"dark"}
            className={"wrapper"}
        >
            <Frame
                options={[]}
                label={translate("TITLE")}
                pageInfo={{
                    closeEvent: FRAME_EVENTS.CLOSE,
                    minimizeEvent: FRAME_EVENTS.MINIMIZE,
                    maximizeEvent: FRAME_EVENTS.MAXIMIZE
                }}/>
            <div className={styles.wrapper}>
                <div className={styles.wrapperProjects}>
                    <div className={styles.titleWrapper}>
                        <div className={styles.title}>
                            <h2>{translate("PROJECTS")}</h2>
                            <Search height={"30px"} setSearchString={setSearchString} searchString={searchString}/>
                        </div>
                        <Dropdown
                            className={styles.button}
                            variant={"filled"} hideArrow={true}
                            wrapperClassname={styles.createModal}
                        >
                            <Icon styles={{fontSize: "1.1rem"}}>add</Icon>
                            {translate("CREATE")}
                            <DropdownOptions>
                                <Create setProjects={setProjects}/>
                            </DropdownOptions>
                        </Dropdown>
                    </div>
                    {!searchString ? <Recent open={(p) => openProject(p)} projects={projectsToShow}/> : null}

                    {projectsToShow.length === 0 ?
                        <div className={styles.emptyWrapper}>
                            <Icon styles={{fontSize: "100px"}}>folder</Icon>
                            {translate("EMPTY")}
                        </div>
                        :
                        <div className={styles.content}>
                            {projectsToShow.map((p, i) => (
                                <React.Fragment key={p.id}>
                                    <Card
                                        open={() => openProject(p)}
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
            </div>
        </ThemeProvider>
    )
}



