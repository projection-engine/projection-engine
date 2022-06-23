import styles from "../styles/Projects.module.css"
import PropTypes from "prop-types"
import React, {useContext, useMemo, useState} from "react"
import Card from "./Card"
import {Dropdown, DropdownOptions, DropdownProvider, Icon, Masonry, TextField} from "@f-ui/core"
import FileSystem from "../../project/utils/files/FileSystem"
import EN from "../../static/locale/EN"


export default function Projects(props) {
    const [searchString, setSearchString] = useState("")

    const projectsToShow = useMemo(() => {
        return props.projects
            .filter(p => p.meta.name?.toLowerCase().includes(searchString.toLowerCase()))
    }, [searchString, props.projects])

    return (
        <div className={styles.wrapper}>
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
                        <Create setProjects={props.setProjects}/>
                    </DropdownOptions>
                </Dropdown>
            </div>
            {projectsToShow.length === 0 ?

                <div className={styles.emptyWrapper}>
                    <Icon styles={{fontSize: "100px"}}>folder</Icon>
                    {EN.HOME.PROJECTS.EMPTY}
                </div>
                :
                <Masonry className={styles.content}>
                    {projectsToShow.map((p, i) => (
                        <React.Fragment key={p.id}>
                            <Card
                                data={p} index={i}
                                onRename={newName => {
                                    props.renameProject(newName, p.id)
                                }}
                                onDelete={() => {
                                    props.deleteProject(p.id)
                                }}/>
                        </React.Fragment>
                    ))}
                </Masonry>
            }
        </div>

    )
}

Projects.propTypes = {
    deleteProject: PropTypes.func.isRequired, 
    refresh: PropTypes.func,
    renameProject: PropTypes.func.isRequired,
    projects: PropTypes.array,
    setProjects: PropTypes.func
}

function Create(props) {
    const {setProjects} = props
    const [projectName, setProjectName] = useState("")
    const dropdownContext = useContext(DropdownProvider)

    return (
        <TextField
            handleChange={e => setProjectName(e)}
            label={"New project"}
            placeholder={"New project"}
            value={projectName}
            onEnter={async () => {
                const res = await FileSystem.createProject(projectName)
                setProjects(prev => {
                    return [...prev, {
                        id: res,
                        meta: {
                            name: projectName
                        }
                    }]
                })
                alert.pushAlert("Project created", "success")
                setProjectName("")
                dropdownContext.setOpen(false)
            }}
            height={"30px"}
        />

    )
}

Create.propTypes={
    setProjects: PropTypes.func
}