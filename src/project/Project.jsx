import React from "react";
import styles from './styles/Project.module.css'
import QuickAccessProvider from "./hooks/QuickAccessProvider";
import Tabs from "../components/tabs/Tabs";
import {ENTITY_ACTIONS} from "./engine/useEngineEssentials";
import SettingsProvider from "./hooks/SettingsProvider";
import FilesView from "./components/files/FilesView";
import Main from "./components/main/Main";
import EntitiesProvider from "./hooks/EntitiesProvider";
import handleTabChange from "./utils/handleTabChange";
import Frame from "../components/frame/Frame";
import useProjectWrapper from "./hooks/useProjectWrapper";
import TabSelector from "./components/main/components/TabSelector";

const {shell} = window.require('electron')
export default function Project({id, meta, events, initialized, setInitialized, settings}) {
    const {
        load,
        setAlert, setFilesLoaded,
        currentTab, setCurrentTab,
        exporter, entitiesWithMeshes, openTab,
        serializer, engine,
        executingAnimation, setExecutingAnimation,
        quickAccess, filesLoaded
    } = useProjectWrapper(id, initialized, setInitialized, settings)

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
                    <Frame
                        logoAction={true}
                        options={[
                            {
                                label: 'File',
                                options: [
                                    {
                                        label: 'Save project',
                                        icon: 'save',
                                        shortcut: 'Ctrl + S',
                                        onClick: () => serializer.save()
                                    },
                                    {
                                        label: 'Export project',
                                        disabled: true,
                                        icon: 'save_alt',
                                        onClick: () => {
                                            exporter.build({
                                                entities: engine.entities,
                                                meshes: engine.meshes,
                                                materials: engine.materials,
                                                scripts: engine.scripts
                                            })
                                                .then(() => {
                                                    setAlert({
                                                        type: 'success',
                                                        message: 'Successfully exported'
                                                    })
                                                    setTimeout(() => {
                                                        shell.openPath(quickAccess.fileSystem.path + '\\out\\web').catch()
                                                    }, 2000)
                                                })
                                                .catch(() => setAlert({
                                                    type: 'error',
                                                    message: 'Error during packaging process'
                                                }))
                                        }
                                    }
                                ]
                            }
                        ]} hasLogo={true} pageInfo={events} label={meta?.name}/>
                    <div className={styles.wrapper}>
                        <Tabs
                            handleTabClose={(newTab, lastTab) => {
                                engine.setCanRender(true)
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
                            <Main
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
                            {filesLoaded.length > 0 ? filesLoaded.map((file, index) => (
                                <React.Fragment key={index + '-tab-wrapper'}>
                                    <TabSelector {...{
                                        file, index: index + 1, setAlert, setFilesLoaded,
                                        currentTab, setCurrentTab, engine,
                                        id, quickAccess, filesLoaded
                                    }}/>
                                </React.Fragment>
                            )) : null}
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

