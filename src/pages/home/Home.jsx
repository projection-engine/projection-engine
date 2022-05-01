import {Button, Modal, Switcher, TextField,} from "@f-ui/core";
import styles from './styles/Home.module.css'
import React, {useState} from "react";
import Projects from "./components/Projects";
import FileSystem from "../project/utils/workers/files/FileSystem";

import EVENTS from "../project/utils/utils/EVENTS";
import useProjects from "./hooks/useProjects";
import SideBar from "./components/SideBar";
import IssuesList from "./issues/issues/IssuesList";

const fs = window.require('fs')
const pathResolve = window.require('path')

export default function Home(props) {
    const {
        projects,
        openModal, setOpenModal,
        projectName, setProjectName,
        setAlert, refresh,
        load, uploadRef,
          setProjects
    } = useProjects(fs)
    const [open, setOpen] = useState(0)
    return (
        <div className={styles.wrapper}>
            <Modal
                open={openModal}
                handleClose={() => {
                    setProjectName('')
                    setOpenModal(false)
                }} className={styles.modal}>
                <TextField
                    handleChange={e => setProjectName(e.target.value)}
                    label={'Project name'}
                    placeholder={'Project name'}
                    value={projectName} size={'small'}/>
                <Button
                    variant={'filled'}
                    disabled={projectName === ''}
                    className={styles.submitButton}
                    onClick={() => {
                        console.log(projectName)
                        FileSystem.createProject(projectName)
                            .then(res => {
                                setProjects(prev => {
                                    return [...prev, {
                                        id: res,
                                        meta: {
                                            name: projectName
                                        }
                                    }]
                                })
                            })

                        setProjectName('')
                        setOpenModal(false)

                    }}
                >
                    Create project
                </Button>
            </Modal>
            <SideBar open={open} setOpen={setOpen} />
            <input style={{display: 'none'}}
                   type={'file'}
                   accept={['.projection']}
                   onChange={f => {
                       load.pushEvent(EVENTS.PROJECT_IMPORT)
                       // TODO - IMPORT
                       f.target.value = ''
                   }}
                   ref={uploadRef}/>

            <Switcher openChild={open} styles={{width: '100%'}}>
                <Projects
                    onNew={() => setOpenModal(true)}
                    onLoad={() => uploadRef.current.click()}
                    deleteProject={pjID => {
                        load.pushEvent(EVENTS.PROJECT_DELETE)
                        fs.rm(
                            pathResolve.resolve(localStorage.getItem('basePath') + '\\projects\\' + pjID),
                            {recursive: true, force: true},
                            (e) => {
                                load.finishEvent(EVENTS.PROJECT_DELETE)
                                setProjects(prev => {
                                    return prev.filter(e => e.id !== pjID)
                                })
                            })
                    }}
                    renameProject={(newName, projectID) => {

                        const pathName = pathResolve.resolve(localStorage.getItem('basePath') + '\\projects\\' + projectID + '\\.meta')

                        fs.readFile(pathName, (error, res) => {
                            if (res && !error) {
                                fs.writeFile(pathName, JSON.stringify({
                                    ...JSON.parse(res.toString()),
                                    name: newName
                                }), (e) => {

                                    if (!e)
                                        setAlert({
                                            type: 'success',
                                            message: 'Project renamed'
                                        })
                                    else
                                        setAlert({
                                            type: 'error',
                                            message: 'Error renaming project.'
                                        })
                                })
                            }
                        })
                    }}
                    refresh={() => refresh()}
                    load={load} projects={projects}

                    setProjects={setProjects}/>
                <IssuesList/>
            </Switcher>
        </div>
    )
}

