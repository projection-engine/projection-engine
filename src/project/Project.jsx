import React, {useMemo, useState} from "react"
import styles from "./styles/Project.module.css"
import QuickAccessProvider from "./utils/hooks/QuickAccessProvider"
import {ENTITY_ACTIONS} from "./engine/useEngineEssentials"
import SettingsProvider from "./utils/hooks/SettingsProvider"
import FilesView from "./components/files/FilesView"
import Editor from "./components/editor/Editor"
import EntitiesProvider from "./utils/hooks/EntitiesProvider"
import Frame from "../components/frame/Frame"
import useProjectWrapper from "./utils/hooks/useProjectWrapper"
import FileSystem from "./utils/files/FileSystem"
import FILE_TYPES from "../../public/project/glTF/FILE_TYPES"
import useOptions from "./components/editor/hooks/useOptions"
import Header from "./components/header/Header"
import Tabs from "../components/tabs/Tabs"
import OpenFileProvider from "./utils/hooks/OpenFileProvider"
import ScriptView from "./components/blueprints/scripts/ScriptView"
import MaterialView from "./components/blueprints/material/MaterialView"
import refreshData from "./utils/refreshData"
import PropTypes from "prop-types"

const {shell} = window.require("electron")
export default function Project(props) {
    const {id, meta, events, initialized, setInitialized, settings} = props
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
        () => {
            setOpenTab(openFiles.length +1 )
            setOpenFiles(prev => [...prev, {name: "Level Blueprint", type: "flow", isLevelBlueprint: true}])
        },
        setAlert
    )


    const submitPackage = (pack, close, previewImage, isLevel, registryID, matInstance) => {
        if(!isLevel) {
            let p = previewImage
            if(matInstance)
                p = engine.renderer.generatePreview(matInstance)
            quickAccess.fileSystem
                .updateAsset(registryID, pack, p)
                .then(() => {
                    if (matInstance)
                        engine.setMaterials(prev => prev.map(p => p.id === registryID ? matInstance : p))
                    else {
                        setTimeout(() => {
                            setAlert({type: "warning", message: "Reloading script"})
                            refreshData(FILE_TYPES.SCRIPT, registryID, quickAccess.fileSystem, engine)
                        }, 1000)
                    }
                    setAlert({type: "success", message: "Saved"})
                })
                .catch(() => {
                    setAlert({type: "error", message: "Some error occurred"})
                })
        }
        else
            quickAccess.fileSystem.writeFile( FileSystem.sep + "levelBlueprint" + FILE_TYPES.SCRIPT, pack)
                .then(() => {
                    setAlert({type: "success", message: "Saved"})
                    
                    setTimeout(() => {
                        setAlert({type: "warning", message: "Reloading script"})
                        refreshData(undefined, undefined, quickAccess.fileSystem, engine)
                    }, 1000)
                })
                .catch(() => {

                    setAlert({type: "error", message: "Some error occurred"})
                })
    }

    const tabs = useMemo(() => {
        return openFiles.map((o, i)=> {
            switch ("." + o.type) {
            case FILE_TYPES.MATERIAL:
                return {
                    label: o.label,
                    icon: "texture",
                    children: (
                        <MaterialView
                            name={o.label}
                            engine={engine}
                            open={i === openTab}
                            registryID={o.registryID}
                            submitPackage={(pack, close, previewImage, isLevel, matInstance) => submitPackage(pack, close, previewImage, isLevel, o.registryID, matInstance)}
                        />
                    ),
                    close: () => {
                        engine.renderer.overrideMaterial = undefined
                        setOpenFiles(prev => prev.filter(p => p.registryID !== o.registryID))
                        refreshData(FILE_TYPES.MATERIAL, o.registryID, quickAccess.fileSystem, engine, load)
                    },

                }
            case FILE_TYPES.SCRIPT:
                return {
                    label: o.label,
                    icon: o.isLevelBlueprint ? "foundation" : "code",
                    children: (
                        <ScriptView
                            name={o.label}
                            engine={engine} isLevelBp={o.isLevelBlueprint}
                            submitPackage={(pack, close, previewImage) => submitPackage(pack, close, previewImage, o.isLevelBlueprint, o.registryID)}
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
    }, [openFiles, openTab, engine.entities])

    return (
        <OpenFileProvider.Provider value={{openFiles, setOpenFiles, openTab, setOpenTab}}>
            <EntitiesProvider.Provider value={{
                entities: entitiesWithMeshes, removeEntities: (entities) => {
                    engine.setSelected([])
                    engine.dispatchEntities({
                        type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: entities
                    })
                    entities.forEach(entity => quickAccess.fileSystem.deleteEntity(entity))
                }, engine
            }}>
                <SettingsProvider.Provider value={settings}>
                    <QuickAccessProvider.Provider value={quickAccess}>
                        <Frame
                            logoAction={true}
                            options={[{
                                label: "File", options: [{
                                    label: "Save project",
                                    icon: "save",
                                    shortcut: "Ctrl + S",
                                    onClick: () => serializer.save()
                                }, {
                                    label: "Export project", disabled: true, icon: "save_alt", onClick: () => {
                                        exporter.build({
                                            entities: engine.entities,
                                            meshes: engine.meshes,
                                            materials: engine.materials,
                                            scripts: engine.scripts
                                        })
                                            .then(() => {
                                                setAlert({
                                                    type: "success", message: "Successfully exported"
                                                })
                                                setTimeout(() => {
                                                    shell.openPath(quickAccess.fileSystem.path + FileSystem.sep + "out" + FileSystem.sep + "web").catch()
                                                }, 2000)
                                            })
                                            .catch(() => setAlert({
                                                type: "error", message: "Error during packaging process"
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
                                orientation={"vertical"}
                                tabs={[
                                    {
                                        label: "Files",
                                        icon: "folder",
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

Project.propTypes={
    id: PropTypes.string,
    meta: PropTypes.object,
    events: PropTypes.array,
    initialized: PropTypes.bool,
    setInitialized: PropTypes.func,
    settings: PropTypes.object
}