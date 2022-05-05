import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AlertProvider} from "@f-ui/core";
import styles from './styles/Project.module.css'
import useQuickAccess from "./hooks/useQuickAccess";
import QuickAccessProvider from "./hooks/QuickAccessProvider";
import Preferences from "../../components/preferences/Preferences";
import GlobalOptions from "../../components/options/GlobalOptions";
import Tabs from "../../components/tabs/Tabs";
import ProjectLoader from "./workers/ProjectLoader";
import {ENTITY_ACTIONS} from "../../engine/hooks/useEngineEssentials";
import useSerializer from "./hooks/useSerializer";

import useEditorEngine from "../../engine/hooks/useEditorEngine";
import useSettings from "./hooks/useSettings";
import EVENTS from "./utils/EVENTS";
import SettingsProvider from "./hooks/SettingsProvider";
import FilesView from "../../views/files/FilesView";
import Editor from "../../views/editor/Editor";
import MeshView from "../../views/mesh/MeshView";
import MaterialView from "../../views/blueprints/material/MaterialView";
import ImageView from "../../views/image/ImageView";
import EntitiesProvider from "./hooks/EntitiesProvider";
import BlueprintView from "../../views/blueprints/scripts/BlueprintView";
import handleTabChange from "./utils/handleTabChange";
import COMPONENTS from "../../engine/templates/COMPONENTS";
import MinimalBlueprintView from "../../views/blueprints/scripts/MinimalBlueprintView";
import LoaderProvider from "../../components/loader/LoaderProvider";
import {useParams} from "react-router-dom";


export default function Project() {
    const {id} = useParams()
    const [executingAnimation, setExecutingAnimation] = useState(false)
    const alert = useContext(AlertProvider)
    const setAlert = ({type, message}) => {
        alert.pushAlert(message, type)
    }
    const settings = useSettings()
    const load = useContext(LoaderProvider)
    const [loading, setLoading] = useState(true)
    const [initialized, setInitialized] = useState(false)
    const engine = useEditorEngine(id, executingAnimation, settings, load, initialized, setAlert)
    const quickAccess = useQuickAccess(id, load)
    const [filesLoaded, setFilesLoaded] = useState([])
    const [currentTab, setCurrentTab] = useState(0)
    const serializer = useSerializer(engine, setAlert, settings, id, quickAccess, currentTab)

    useEffect(() => {
        load.pushEvent(EVENTS.PROJECT_DATA)
        if (engine.gpu && !loading.initialized) {
            new Promise(async resolve => {
                try {
                    const res = await ProjectLoader.loadProject(engine.gpu, quickAccess.fileSystem)
                    load.finishEvent(EVENTS.PROJECT_DATA)

                    engine.setScripts(res.scripts)
                    engine.setMeshes(res.meshes)
                    engine.setMaterials(res.materials)
                    engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: res.entities})
                    if (res.settings && res.settings.data)
                        Object.keys(res.settings.data).forEach(key => {
                            settings[key] = res.settings.data[key]
                        })
                    if (res.meta && res.meta.data)
                        settings.name = res.meta.data.name
                    setLoading(false)
                } catch (error) {
                }
                setInitialized(true)
                resolve()
            }).catch()
        }
    }, [engine.gpu])

    const getTab = (file, index) => {
        if (!file.isLevelBlueprint)
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
                case 'flow':
                    return <BlueprintView
                        index={index}
                        file={file}
                        submitPackage={(pack, close) => {
                            quickAccess.fileSystem
                                .updateAsset(file.registryID, pack)
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
                        setAlert={setAlert}/>
                default:
                    return null
            }
        else
            return (
                <MinimalBlueprintView
                    index={index}
                    name={'Level Blueprint'}
                    id={id}
                    engine={engine}
                    submitPackage={(pack, close) => {

                        quickAccess.fileSystem
                            .createFile('levelBlueprint.flow', pack)
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
                    setAlert={setAlert}
                />
            )
    }
    const openTab = useCallback((fileID, fileName) => {
        const found = filesLoaded.find(f => {
            return f.registryID === fileID
        })

        if (!found) {
            load.pushEvent(EVENTS.LOAD_FILE)
            quickAccess.fileSystem.readRegistryFile(fileID)
                .then(res => {
                    engine.setCanRender(false)
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
                mesh: e.components[COMPONENTS.MESH].meshID,
                material: engine.meshes.find(m => m.id === e.components[COMPONENTS.MESH].meshID)?.materialID
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
                        <GlobalOptions engine={engine} setAlert={setAlert} save={serializer.save} quickAccess={quickAccess}/>
                        <Tabs
                            handleTabClose={(newTab, lastTab) => {

                                handleTabChange(filesLoaded, lastTab, quickAccess.fileSystem, engine, load)
                                setFilesLoaded(prev => {
                                    const newD = [...prev]

                                    newD.splice(newTab, 1)
                                    return newD
                                })
                            }}
                            onTabSwitch={(newTab, lastTab) => {
                                if (newTab === 0)
                                    handleTabChange(filesLoaded, lastTab, quickAccess.fileSystem, engine, load)
                            }}
                            tab={currentTab}
                            setTab={setCurrentTab}

                        >
                            <Editor
                                setExecutingAnimation={setExecutingAnimation}
                                executingAnimation={executingAnimation}
                                engine={engine}
                                id={id} load={load}
                                openLevelBlueprint={() => {
                                    setFilesLoaded(prev => {
                                        return [...prev, {
                                            isLevelBlueprint: true
                                        }]
                                    })
                                    setCurrentTab(filesLoaded.length + 1)
                                }}
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
                                id={id}
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

