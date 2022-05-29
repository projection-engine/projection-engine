import React, {useMemo, useState} from "react";
import styles from './styles/Project.module.css'
import QuickAccessProvider from "./hooks/QuickAccessProvider";
import {ENTITY_ACTIONS} from "./engine/useEngineEssentials";
import SettingsProvider from "./hooks/SettingsProvider";
import FilesView from "./components/files/FilesView";
import Editor from "./components/editor/Editor";
import EntitiesProvider from "./hooks/EntitiesProvider";
import Frame from "../components/frame/Frame";
import useProjectWrapper from "./hooks/useProjectWrapper";
import FileSystem from "./utils/files/FileSystem";
import FILE_TYPES from "../../public/project/glTF/FILE_TYPES";
import useOptions from "./components/editor/hooks/useOptions";
import Header from "./components/header/Header";
import Tabs from "../components/tabs/Tabs";
import OpenFileProvider from "./hooks/OpenFileProvider";
import BlueprintView from "./components/blueprints/scripts/BlueprintView";
import MaterialView from "./components/blueprints/material/MaterialView";
import refreshData from "./utils/refreshData";

const {shell} = window.require('electron')
export default function Project({id, meta, events, initialized, setInitialized, settings}) {
    const {
        setAlert,
        exporter,
        entitiesWithMeshes,
        load,
        serializer,
        engine,
        quickAccess,
        setExecutingAnimation,
        executingAnimation,
        openTab, setOpenTab
    } = useProjectWrapper(id, initialized, setInitialized, settings)
    const [openFiles, setOpenFiles] = useState([])
    const options = useOptions(
        executingAnimation,
        setExecutingAnimation,
        engine,
        serializer.save,
        () => null, // TODO
        setAlert
    )
    const submitPackage = (pack, close, previewImage, isLevel, registryID) => {
        console.log(pack, close, previewImage, isLevel, registryID)
        quickAccess.fileSystem
            .updateAsset(isLevel ? FileSystem.sep + 'levelBlueprint' + FILE_TYPES.SCRIPT : registryID, pack, previewImage)
            .then(_ => setAlert({type: 'success', message: 'Saved'}))
            .catch(_ => setAlert({type: 'error', message: 'Some error occurred'}))
    }

    const tabs = useMemo(() => {
        return openFiles.map(o => {
            switch ('.' + o.type) {
                case FILE_TYPES.MATERIAL:
                    return {
                        label: o.label,
                        icon: 'texture',
                        children: (
                            <MaterialView
                                name={o.label}
                                engine={engine}
                                registryID={o.registryID}
                                submitPackage={(pack, close, previewImage, isLevel) => submitPackage(pack, close, previewImage, isLevel, o.registryID)}
                            />
                        ),
                        close: () => {
                            engine.renderer.overrideMaterial = undefined
                            setOpenFiles(prev => prev.filter(p => p.registryID !== o.registryID))
                            refreshData(FILE_TYPES.MATERIAL, o.registryID, quickAccess.fileSystem, engine, load)
                        }
                    }
                case FILE_TYPES.SCRIPT:
                    return {
                        label: o.label,
                        icon: 'code',
                        children: (
                            <BlueprintView
                                name={o.label}
                                engine={engine}
                                submitPackage={(pack, close, previewImage, isLevel) => submitPackage(pack, close, previewImage, isLevel, o.registryID)}
                                setAlert={setAlert}
                                id={o.registryID}
                            />
                        ),
                        close: () => {
                            setOpenFiles(prev => prev.filter(p => p.registryID !== o.registryID))
                            refreshData(FILE_TYPES.SCRIPT, o.registryID, quickAccess.fileSystem, engine, load)
                        }
                    }
                default:
                    return undefined
            }
        }).filter(e => e)
    }, [openFiles])
    return (
        <OpenFileProvider.Provider value={{openFiles, setOpenFiles, openTab, setOpenTab}}>
            <EntitiesProvider.Provider value={{
                entities: entitiesWithMeshes, removeEntities: (entities) => {
                    engine.setSelected([])
                    engine.dispatchEntities({
                        type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: entities
                    })
                    entities.forEach(entity => quickAccess.fileSystem.deleteEntity(entity))
                }
            }}>
                <SettingsProvider.Provider value={settings}>
                    <QuickAccessProvider.Provider value={quickAccess}>
                        <Frame
                            logoAction={true}
                            options={[{
                                label: 'File', options: [{
                                    label: 'Save project',
                                    icon: 'save',
                                    shortcut: 'Ctrl + S',
                                    onClick: () => serializer.save()
                                }, {
                                    label: 'Export project', disabled: true, icon: 'save_alt', onClick: () => {
                                        exporter.build({
                                            entities: engine.entities,
                                            meshes: engine.meshes,
                                            materials: engine.materials,
                                            scripts: engine.scripts
                                        })
                                            .then(() => {
                                                setAlert({
                                                    type: 'success', message: 'Successfully exported'
                                                })
                                                setTimeout(() => {
                                                    shell.openPath(quickAccess.fileSystem.path + FileSystem.sep + 'out' + FileSystem.sep + 'web').catch()
                                                }, 2000)
                                            })
                                            .catch(() => setAlert({
                                                type: 'error', message: 'Error during packaging process'
                                            }))
                                    }
                                }]
                            }]}
                            hasLogo={true}
                            pageInfo={events}
                            label={meta?.name}/>

                        <div className={styles.wrapper}>
                            <Header options={options}/>
                            <Editor
                                {...{
                                    setExecutingAnimation: setExecutingAnimation,
                                    executingAnimation: executingAnimation,
                                    engine: engine,
                                    id: id,
                                    load: load,
                                    setAlert: setAlert,
                                    settings: settings,
                                    serializer: serializer,
                                }}/>

                            <Tabs
                                open={openTab}
                                setOpen={setOpenTab}
                                orientation={'vertical'}
                                tabs={[
                                    {
                                        label: 'Files',
                                        icon: 'folder',
                                        children: (
                                            <FilesView
                                                setAlert={setAlert}
                                                id={id}
                                            />
                                        )
                                    },
                                    ...tabs
                                ]}
                            />
                        </div>
                    </QuickAccessProvider.Provider>
                </SettingsProvider.Provider>
            </EntitiesProvider.Provider>
        </OpenFileProvider.Provider>
    )
}

