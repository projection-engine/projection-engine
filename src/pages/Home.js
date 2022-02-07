import {Alert, Button, Modal, TextField,} from "@f-ui/core";
import styles from './styles/Home.module.css'
import React, {useContext, useEffect, useRef, useState} from "react";

import LoadProvider from "../views/editor/hook/LoadProvider";
import EVENTS from "../views/editor/utils/misc/EVENTS";
import randomID from "../views/editor/utils/misc/randomID";
import Maker from "../services/workers/Maker";
import Projects from "../components/projects/Projects";
import ThemeProvider from "../views/editor/hook/ThemeProvider";
import PropTypes from "prop-types";
import logo from '../static/LOGO.png'
import gitDark from '../static/github/dark.svg'
import gitLight from '../static/github/light.svg'
import Database from "../components/db/Database";
// import Database from "../components/db/Database";


export default function Home(props) {
    const [projects, setProjects] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [alert, setAlert] = useState({})

    const [database, setDatabase] = useState()
    const load = useContext(LoadProvider)
    const uploadRef = useRef()
    const theme = useContext(ThemeProvider)
    const refresh = (db) => {
        db?.listProject()
            .then(res => {
                window.alert(res)
                setProjects(res.map(re => {
                    return {
                        ...re,
                        meta: JSON.parse(re.meta),
                        settings: JSON.parse(re.settings)
                    }
                }))
                load.finishEvent(EVENTS.PROJECT_LIST)
            })
    }

    useEffect(() => {

        load.pushEvent(EVENTS.PROJECT_LIST)
        load.finishEvent(EVENTS.PROJECT_SETTINGS)

        const db = new Database('FS')
        setDatabase(db)
        refresh(db)
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
                        const now = (new Date()).toDateString()
                        const newData = {
                            id: randomID(),
                            meta: JSON.stringify({
                                lastModification: now,
                                entities: 0,
                                meshes: 0,
                                materials: 0
                            }),
                            settings: JSON.stringify({
                                projectName: projectName
                            })
                        }

                        database?.postProject(newData)
                            .then(r => {

                                setAlert({
                                    type: 'success',
                                    message: 'Project created.'
                                })
                                setProjects(prev => {
                                    return [...prev, {
                                        ...newData,
                                        settings: JSON.parse(newData.settings),
                                        meta: JSON.parse(newData.meta)
                                    }]
                                })
                                setProjectName('')
                                setOpenModal(false)
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
                    <Button onClick={() => theme.setDark(!theme.dark)} className={styles.button} variant={'outlined'}>
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
                       Maker.parse(f.target.files[0], database)
                           .then((res) => {
                               let promises = []
                               const pj = res.find(data => data.type === 0)

                               if (!projects.find(p => p.id === JSON.parse(pj.data).id)) {
                                   res.forEach(data => {
                                       const parsed = JSON.parse(data.data)

                                       if (data.type === 0)
                                           promises.push(new Promise(resolve => {
                                               database?.postProject({
                                                   id: parsed.id,
                                                   settings: parsed.settings,
                                                   meta: parsed.meta
                                               }).then(() => resolve()).catch(() => resolve())
                                           }))
                                       else if (data.type === 1)
                                           promises.push(new Promise(resolve => {
                                               database?.postFileWithBlob(parsed, parsed.blob).then(() => resolve()).catch(() => resolve())
                                           }))
                                       else if (data.type === 2) {
                                           promises.push(new Promise(resolve => database?.postEntity(parsed).then(() => resolve()).catch(() => resolve())))
                                       }
                                   })
                                   Promise.all(promises).then(() => {
                                       load.finishEvent(EVENTS.PROJECT_IMPORT)
                                       refresh(database)
                                   })
                               } else {
                                   load.finishEvent(EVENTS.PROJECT_IMPORT)
                                   setAlert({
                                       type: 'error',
                                       message: 'Project already exists.'
                                   })
                               }

                           })
                       f.target.value = ''
                   }}
                   ref={uploadRef}/>

            <Projects
                onNew={() => setOpenModal(true)}
                onLoad={() => uploadRef.current.click()}
                database={database}

                refresh={() => refresh(database)} load={load} projects={projects}
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