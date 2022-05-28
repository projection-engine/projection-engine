import React from "react";
import styles from './styles/Project.module.css'
import QuickAccessProvider from "./hooks/QuickAccessProvider";
import TabRouter from "./components/router/TabRouter";
import {ENTITY_ACTIONS} from "./engine/useEngineEssentials";
import SettingsProvider from "./hooks/SettingsProvider";
import FilesView from "./components/files/FilesView";
import Editor from "./components/editor/Editor";
import EntitiesProvider from "./hooks/EntitiesProvider";
import refreshData from "./utils/refreshData";
import Frame from "../components/frame/Frame";
import useProjectWrapper from "./hooks/useProjectWrapper";
import FileSystem from "./utils/files/FileSystem";
import {HashRouter, Route, Routes} from "react-router-dom";
import PropTypes from "prop-types";
import FILE_TYPES from "../../public/project/glTF/FILE_TYPES";

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
        executingAnimation
    } = useProjectWrapper(id, initialized, setInitialized, settings)

    return (
        <HashRouter>
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
                            <TabRouter
                                refreshData={(type, regID) => refreshData(type, regID, quickAccess.fileSystem, engine, load)}
                                mainProps={{
                                    setExecutingAnimation: setExecutingAnimation,
                                    executingAnimation: executingAnimation,
                                    engine: engine,
                                    id: id,
                                    load: load,
                                    setAlert: setAlert,
                                    settings: settings,
                                    serializer: serializer,
                                }}
                                levelProps={{
                                    engine: engine, id: id
                                }}
                                submitPackage={(pack, close, previewImage, isLevel) => {
                                    quickAccess.fileSystem
                                    .updateAsset(isLevel ? FileSystem.sep + 'levelBlueprint' + FILE_TYPES.SCRIPT : file.registryID, pack, previewImage)
                                    .then(_ => setAlert({type: 'success', message: 'Saved'}))
                                    .catch(_ => setAlert({type: 'error', message: 'Some error occurred'}))
                                }}
                            />
                            <FilesView
                                setAlert={setAlert}
                                id={id}
                            />
                        </div>
                    </QuickAccessProvider.Provider>
                </SettingsProvider.Provider>
            </EntitiesProvider.Provider>
        </HashRouter>
    )
}

