import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AlertProvider, LoaderProvider} from "@f-ui/core";
import styles from './styles/Project.module.css'
import Maker from "../../services/workers/Maker";
import useQuickAccess from "./hook/useQuickAccess";
import QuickAccessProvider from "../../services/hooks/QuickAccessProvider";
import PropTypes from "prop-types";
import Preferences from "../../components/preferences/Preferences";
import GlobalOptions from "../../components/options/GlobalOptions";
import Tabs from "../../components/tabs/Tabs";
import ProjectLoader from "../../services/workers/ProjectLoader";
import {ENTITY_ACTIONS} from "../../services/utils/entityReducer";
import useSerializer from "./hook/useSerializer";

import useEngine from "../../services/hooks/useEngine";
import useSettings from "./hook/useSettings";
import EVENTS from "../../services/utils/misc/EVENTS";
import SettingsProvider from "../../services/hooks/SettingsProvider";
import FilesView from "../../views/files/FilesView";
import Editor from "../../views/editor/Editor";
import MeshView from "../../views/mesh/MeshView";
import MaterialView from "../../views/material/MaterialView";
import ImageView from "../../views/image/ImageView";
import EntitiesProvider from "../../services/hooks/EntitiesProvider";


export default function Project(props) {
    const [executingAnimation, setExecutingAnimation] = useState(false)
    const alert = useContext(AlertProvider)
    const setAlert = ({type, message}) => {
        alert.pushAlert(message, type)
    }
    const settings = useSettings()
    const load = useContext(LoaderProvider)
    const [loading, setLoading] = useState({
        data: true,
        initialized: false
    })

    const engine = useEngine(props.id, executingAnimation, settings, load, loading.data === false)

    const quickAccess = useQuickAccess(props.id, load)
    const serializer = useSerializer(engine, setAlert, settings, props.id, quickAccess)
    const [filesLoaded, setFilesLoaded] = useState([])
    const [currentTab, setCurrentTab] = useState(0)

    useEffect(() => {
        if (engine.gpu && !loading.initialized) {
            setLoading({
                data: true,
                initialized: true
            })
            load.pushEvent(EVENTS.PROJECT_DATA)
            ProjectLoader
                .loadProject(engine.gpu, quickAccess.fileSystem)
                .then(res => {
                    engine.setMeshes(res.meshes)
                    engine.setMaterials(res.materials)
                    engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: res.entities})
                    if (res.settings)
                        Object.keys(res.settings.data).forEach(key => {
                            settings[key] = res.settings.data[key]
                        })
                    if (res.meta)
                        settings.name = res.meta.data.name

                    load.finishEvent(EVENTS.PROJECT_DATA)
                    setLoading({
                        data: false,
                        initialized: true
                    })
                })
                .catch(e => {
                    load.finishEvent(EVENTS.PROJECT_DATA)
                    setLoading({
                        data: false,
                        initialized: true
                    })
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

    const entitiesWithMeshes = useMemo(() => {
        return engine.entities.filter(e => {
            return (e.components.MeshComponent)
        }).map(e => {
            return {
                name: e.name,
                entity: e.id,
                mesh: e.components.MeshComponent.meshID,
                material: engine.meshes.find(m => m.id === e.components.MeshComponent.meshID)?.materialID
            }
        })
    }, [engine.entities])
    return (
        <EntitiesProvider.Provider value={{
            entities: entitiesWithMeshes,
            removeEntities: (entities) => {

                engine.setSelected([])
                engine.dispatchEntities({
                    type: ENTITY_ACTIONS.REMOVE_BLOCK,
                    payload: entities
                })
                entities.forEach(entity => quickAccess.fileSystem.deleteEntity(entity))

            }
        }}>
            <SettingsProvider.Provider value={settings}>
                <QuickAccessProvider.Provider value={quickAccess}>
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
                                id={props.id} load={load}
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
        </EntitiesProvider.Provider>
    )
}

Project.propTypes = {
    redirect: PropTypes.func.isRequired,
    id: PropTypes.string
}