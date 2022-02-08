import {Alert, Button, Modal, TextField,} from "@f-ui/core";
import styles from './styles/Home.module.css'
import React, {useContext, useEffect, useRef, useState} from "react";

import Maker from "../../services/workers/Maker";
import Projects from "../../components/projects/Projects";

import PropTypes from "prop-types";
import logo from '../../static/LOGO.png'
import gitDark from '../../static/github/dark.svg'
import gitLight from '../../static/github/light.svg'
import FileSystem from "../../components/db/FileSystem";
import ThemeProvider from "../project/hook/ThemeProvider";
import LoadProvider from "../project/hook/LoadProvider";
import EVENTS from "../project/utils/misc/EVENTS";

const fs = window.require('fs')
const path = window.require('path')

const startPath = 'projects'
export default function Home(props) {
    const [projects, setProjects] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [alert, setAlert] = useState({})

    const load = useContext(LoadProvider)
    const uploadRef = useRef()
    const theme = useContext(ThemeProvider)

    const refresh = () => {
        load.pushEvent(EVENTS.PROJECT_LIST)
        fs.readdir(startPath, (e, res) => {
            let promises = []

            res.forEach(f => {
                promises.push(new Promise((resolve, discard) => {
                    let filename = path.join(startPath, f);
                    fs.lstat(filename, (e, stat) => {
                        if (stat.isDirectory()) {
                            const meta = new Promise(r => fs.readFile(filename + '/.meta', (e, rs) => r(rs)))
                            const settings = new Promise(r => fs.readFile(filename + '/.settings', (e, rs) => r(rs)))
                            const parts = filename.split('\\')

                            Promise.all([meta, settings])
                                .then(r => {
                                    resolve({
                                        id: parts.pop(),
                                        meta: r[0] ? JSON.parse(r[0].toString()) : undefined,
                                        settings: r[1] ? JSON.parse(r[1].toString()) : undefined
                                    })
                                })

                        } else
                            discard()
                    })

                }))
            })

            Promise.all(promises)
                .then(data => {
                    console.log(data)
                    setProjects(data)
                    load.finishEvent(EVENTS.PROJECT_LIST)
                })
        })
    }

    useEffect(() => {
        load.finishEvent(EVENTS.PROJECT_SETTINGS)
        refresh()
    }, [])


    return (
        <div className={styles.wrapper}>

            <Alert open={alert.type !== undefined} variant={alert.type} handleClose={() => setAlert({})}>
                <div style={{color: 'var(--fabric-color-primary)'}}>
                    {alert.message}
                </div>
            </Alert>
            <Modal open={openModal} handleClose={() => {
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

                    }}>
                    Create project
                </Button>
            </Modal>
            <div className={styles.options}>
                <div className={styles.logoWrapper}>
                    <div className={styles.logo}>
                        <img src={logo} alt={'logo'}/>
                    </div>
                    <div className={styles.logoTitle}>
                        Projection Engine
                    </div>
                </div>

                <div style={{display: 'flex', gap: '4px'}}>
                    <Button onClick={() => theme.setDark(!theme.dark)} className={styles.button}
                            variant={'outlined'}>
                        <span className={'material-icons-round'}>{theme.dark ? 'dark_mode' : 'light_mode'}</span>
                    </Button>

                    <Button onClick={() => window.open('https://github.com/projection-engine')}
                            className={styles.button}
                            variant={'outlined'}>
                        <img style={{width: '30px'}} alt={'github'}
                             src={theme.dark ? gitDark : gitLight}/>
                    </Button>

                </div>
            </div>

            <input style={{display: 'none'}}
                   type={'file'}
                   accept={['.projection']}
                   onChange={f => {
                       load.pushEvent(EVENTS.PROJECT_IMPORT)
                       Maker.parse(f.target.files[0])
                           .then((res) => {
                               // let promises = []
                               // const pj = res.find(data => data.type === 0)
                               //
                               // if (!projects.find(p => p.id === JSON.parse(pj.data).id)) {
                               //     res.forEach(data => {
                               //         const parsed = JSON.parse(data.data)
                               //
                               //         if (data.type === 0)
                               //             promises.push(new Promise(resolve => {
                               //                 database?.postProject({
                               //                     id: parsed.id,
                               //                     settings: parsed.settings,
                               //                     meta: parsed.meta
                               //                 }).then(() => resolve()).catch(() => resolve())
                               //             }))
                               //         else if (data.type === 1)
                               //             promises.push(new Promise(resolve => {
                               //                 database?.postFileWithBlob(parsed, parsed.blob).then(() => resolve()).catch(() => resolve())
                               //             }))
                               //         else if (data.type === 2) {
                               //             promises.push(new Promise(resolve => database?.postEntity(parsed).then(() => resolve()).catch(() => resolve())))
                               //         }
                               //     })
                               //     Promise.all(promises).then(() => {
                               //         load.finishEvent(EVENTS.PROJECT_IMPORT)
                               //         refresh(database)
                               //     })
                               // } else {
                               //     load.finishEvent(EVENTS.PROJECT_IMPORT)
                               //     setAlert({
                               //         type: 'error',
                               //         message: 'Project already exists.'
                               //     })
                               // }

                           })
                       f.target.value = ''
                   }}
                   ref={uploadRef}/>

            <Projects
                onNew={() => setOpenModal(true)}
                onLoad={() => uploadRef.current.click()}
                deleteProject={pjID => {
                    load.pushEvent(EVENTS.PROJECT_DELETE)
                    fs.rm('projects/'+pjID, { recursive: true, force: true }, (e) => {

                        load.finishEvent(EVENTS.PROJECT_DELETE)
                        setProjects(prev => {
                            return prev.filter(e => e.id !== pjID)
                        })
                    })
                }}
                renameProject={newName => null}
                refresh={() => refresh()} load={load} projects={projects}
                redirect={id => {
                    props.redirect(id)
                }}
                setProjects={setProjects}/>
        </div>
    )
}

Home.propTypes = {
    redirect: PropTypes.func.isRequired
}