import React, {useCallback, useContext, useEffect, useState} from "react";
import {Alert, LoaderProvider} from "@f-ui/core";
import styles from './styles/Project.module.css'
import Maker from "../../services/workers/Maker";
import useQuickAccess from "./hook/useQuickAccess";
import QuickAccessProvider from "../../services/hooks/QuickAccessProvider";
import PropTypes from "prop-types";
import Preferences from "../../components/preferences/Preferences";
import GlobalOptions from "../../components/options/GlobalOptions";
import Tabs from "../../components/tabs/Tabs";
import ProjectLoader from "../../services/workers/ProjectLoader";
import {ENTITY_ACTIONS} from "../../services/engine/utils/entityReducer";
import useSerializer from "./hook/useSerializer";

import useEngine from "../../services/hooks/useEngine";
import useSettings from "./hook/useSettings";
import EVENTS from "./utils/misc/EVENTS";
import SettingsProvider from "../../services/hooks/SettingsProvider";
import FilesView from "../../views/files/FilesView";
import Editor from "../../views/editor/Editor";
import MeshView from "../../views/mesh/MeshView";
import MaterialView from "../../views/material/MaterialView";
import ImageView from "../../views/image/ImageView";


export default function Project(props) {
    const [executingAnimation, setExecutingAnimation] = useState(false)
    const [alert, setAlert] = useState({})
    const settings = useSettings()
    const load = useContext(LoaderProvider)
    const engine = useEngine(props.id, executingAnimation, settings, load)

    const quickAccess = useQuickAccess(props.id, load)
    const serializer = useSerializer(engine, setAlert, settings, props.id, quickAccess)
    const [filesLoaded, setFilesLoaded] = useState([])
    const [currentTab, setCurrentTab] = useState(0)
    const [initialized, setInitialized] = useState(false)


    useEffect(() => {
        if (engine.gpu && !initialized) {

            load.pushEvent(EVENTS.PROJECT_DATA)
            ProjectLoader
                .loadProject(engine.gpu, quickAccess.fileSystem)
                .then(res => {
                    engine.setMeshes(res.meshes)
                    engine.setMaterials(res.materials)

                    res.entities.forEach(entity => {
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
                    })
                    if (res.settings)
                        Object.keys(res.settings.data).forEach(key => {
                            settings[key] = res.settings.data[key]
                        })
                    if (res.meta)
                        Object.keys(res.meta).forEach(key => {
                            settings[key] = res.meta[key]
                        })

                    load.finishEvent(EVENTS.PROJECT_DATA)
                    setInitialized(true)
                })
                .catch(e => {
                    load.finishEvent(EVENTS.PROJECT_DATA)
                    setInitialized(true)
                })
        }
    }, [engine.gpu])

    const getTab = (file, index) => {
        switch (file.type) {
            case 'mesh':
                return <MeshView file={file} setAlert={setAlert} index={index}/>
            case 'material':
                return (
                    <MaterialView
                        index={index}
                        setAlert={setAlert}
                        submitPackage={(previewImage, pack, close) => {
                            quickAccess.fileSystem
                                .updateAsset(file.registryID, pack, previewImage)
                                .then(() => {
                                    setAlert({
                                        type: 'success',
                                        message: 'Saved'
                                    })
                                    if (close) {
                                        if ((currentTab) === index)
                                            setCurrentTab(filesLoaded.length - 1)
                                        setFilesLoaded(prev => {
                                            const newD = [...prev]
                                            newD.splice(index, 1)
                                            return newD
                                        })
                                    }
                                })

                        }}
                        file={file}
                    />
                )
            case 'image':
                return <ImageView file={file}/>
            default:
                return null
        }
    }
    const openTab = useCallback((fileID, fileName) => {
        const found = filesLoaded.find(f => {
            return f.registryID === fileID
        })

        if (!found) {
            load.pushEvent(EVENTS.LOAD_FILE)
            quickAccess.fileSystem.readRegistryFile(fileID)
                .then(res => {
                    if (res) {
                        load.finishEvent(EVENTS.LOAD_FILE)
                        setFilesLoaded(prev => {
                            return [
                                ...prev,
                                {
                                    registryID: fileID,
                                    type: res.path.split('.').pop(),
                                    name: fileName
                                }
                            ]
                        })
                        setCurrentTab(filesLoaded.length + 1)
                    } else {
                        load.finishEvent(EVENTS.LOAD_FILE)
                        setAlert({
                            type: 'error',
                            message: 'Could not load file.'
                        })
                    }
                })
        } else
            setCurrentTab(filesLoaded.indexOf(found) + 1)
    }, [currentTab, filesLoaded])
    return (

        <SettingsProvider.Provider value={settings}>
            <QuickAccessProvider.Provider value={quickAccess}>
                <Alert
                    open={alert.type !== undefined}
                    handleClose={() => setAlert({})} variant={alert.type}
                    delay={3500}>
                    <div className={styles.alertContent} title={alert.message}>
                        {alert.message}
                    </div>
                </Alert>
                <div className={styles.wrapper}>
                    <Preferences serializer={serializer}/>
                    <GlobalOptions
                        downloadProject={() => {
                            Maker.make(props.id, load, setAlert)

                        }}

                        redirect={props.redirect}
                        save={serializer.save}
                    />
                    <Tabs
                        handleTabClose={(tabIndex) => {
                            setFilesLoaded(prev => {
                                const newD = [...prev]
                                newD.splice(tabIndex - 1, 1)
                                return newD
                            })
                        }}
                        tab={currentTab}
                        setTab={setCurrentTab}>
                        <Editor
                            setExecutingAnimation={setExecutingAnimation}
                            executingAnimation={executingAnimation}
                            engine={engine}
                            id={props.id}
                            setAlert={setAlert}
                            settings={settings}
                            serializer={serializer}
                        />
                        {filesLoaded.map((file, index) => (
                            <React.Fragment key={index + '-tab-wrapper'}>
                                {getTab(file, index + 1)}
                            </React.Fragment>
                        ))}
                    </Tabs>
                    {settings.filesVisibility ?
                        <FilesView
                            setAlert={setAlert}
                            currentTab={currentTab}
                            id={props.id}
                            openEngineFile={openTab}
                        />
                        :
                        null}
                </div>
            </QuickAccessProvider.Provider>
        </SettingsProvider.Provider>

    )
}

Project.propTypes = {
    redirect: PropTypes.func.isRequired,
    id: PropTypes.string
}