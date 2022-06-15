import React, {useMemo, useState} from "react"
import styles from "./styles/Project.module.css"
import {ENTITY_ACTIONS} from "./engine-extension/entityReducer"
import SettingsProvider from "./hooks/SettingsProvider"
import FilesView from "./components/files/FilesView"
import EntitiesProvider from "./hooks/EntitiesProvider"
import Frame from "../components/frame/Frame"
import useProjectWrapper from "./hooks/useProjectWrapper"
import FileSystem from "./utils/files/FileSystem"
import FILE_TYPES from "../../public/project/glTF/FILE_TYPES"
import useOptions from "./hooks/useOptions"
import Header from "./components/header/Header"
import Tabs from "../components/tabs/Tabs"
import OpenFileProvider from "./hooks/OpenFileProvider"
import ScriptView from "./components/blueprints/scripts/ScriptView"
import MaterialView from "./components/blueprints/material/MaterialView"
import refreshData from "./utils/refreshData"
import PropTypes from "prop-types"
import Shortcuts from "./components/shortcuts/Shortcuts"
import ContextMenuProvider from "../components/context/hooks/ContextMenuProvider"
import useContextMenu from "../components/context/hooks/useContextMenu"
import ContextMenu from "../components/context/ContextMenu"
import {Button, ContextWrapper, Icon} from "@f-ui/core"
import Viewport from "./components/viewport/Viewport"
import ResizableBar from "../components/resizable/ResizableBar"
import useEditorShortcuts from "./hooks/useEditorShortcuts"
import submitPackage from "./utils/submitPackage"
import Hierarchy from "./components/hierarchy/Hierarchy"
import View from "../components/view/View"
import ComponentEditor from "./components/component-editor/ComponentEditor"
import {createFolder} from "./components/hierarchy/utils/hiearchyUtils"


const {ipcRenderer, shell} = window.require("electron")
export default function Editor(props) {
    const {id, meta, events, initialized, setInitialized, settings, load} = props
    const {
        exporter,
        entitiesWithMeshes,
        serializer,
        engine, openTab, setOpenTab
    } = useProjectWrapper(id, initialized, setInitialized, settings, props.pushSettingsBlock, load)
    const [openFiles, setOpenFiles] = useState([])
    const contextMenuHook = useContextMenu()
    const options = useOptions(
        engine.executingAnimation,
        engine.setExecutingAnimation,
        engine,
        serializer.save,
        () => {
            setOpenTab(openFiles.length +1 )
            setOpenFiles(prev => [...prev, {name: "Level Blueprint", type: "flow", isLevelBlueprint: true}])
        }
    )

    

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
                            submitPackage={(pack, close, previewImage, isLevel, matInstance) => submitPackage(pack, close, previewImage, isLevel, o.registryID, matInstance, true, engine)}
                        />
                    ),
                    close: () => {
                        engine.renderer.overrideMaterial = undefined
                        setOpenFiles(prev => prev.filter(p => p.registryID !== o.registryID))
                        refreshData(FILE_TYPES.MATERIAL, o.registryID, engine)
                    },

                }
            case FILE_TYPES.SCRIPT:
                return {
                    label: o.label,
                    icon: o.isLevelBlueprint ? "foundation" : "code",
                    children: (
                        <ScriptView
                            name={o.label}
                            engine={engine}
                            file={o}
                            isLevelBp={o.isLevelBlueprint}
                            submitPackage={(pack, close, previewImage) => submitPackage(pack, close, previewImage, o.isLevelBlueprint, o.registryID, undefined, undefined, engine)}
                            id={o.registryID}
                        />
                    ),
                    close: () => {
                        setOpenFiles(prev => prev.filter(p => p.registryID !== o.registryID))
                        refreshData(FILE_TYPES.SCRIPT, o.registryID, engine)
                    }
                }
            default:
                return undefined
            }
        }).filter(e => e)
    }, [openFiles, openTab, engine.entities])

    const utils = useEditorShortcuts({engine, settings, id, serializer})
    return (
        <ContextMenuProvider.Provider value={contextMenuHook}>
            <OpenFileProvider.Provider value={{openFiles, setOpenFiles, openTab, setOpenTab}}>
                <EntitiesProvider.Provider
                    value={{
                        entities: entitiesWithMeshes,
                        removeEntities: (entities) => {
                            engine.setSelected([])
                            engine.dispatchEntities({
                                type: ENTITY_ACTIONS.REMOVE_BLOCK, payload: entities
                            })
                            entities.forEach(entity => document.fileSystem.deleteEntity(entity))
                        }, engine
                    }}>
                    <SettingsProvider.Provider value={settings}>
                        <Frame
                            logoAction={true}
                            options={[
                                {
                                    label: "File", 
                                    options: [{
                                        label: "Save project",
                                        icon: "save",
                                        shortcut: "Ctrl + S",
                                        onClick: () => serializer.save()
                                    }, 
                                    {
                                        label: "Export project", disabled: true, icon: "save_alt", onClick: () => {
                                            exporter.build({
                                                entities: engine.entities,
                                                meshes: engine.meshes,
                                                materials: engine.materials,
                                                scripts: engine.scripts
                                            })
                                                .then(() => {
                                                    alert.pushAlert( "Successfully exported", "success")
                                                    setTimeout(() => {
                                                        shell.openPath(document.fileSystem.path + FileSystem.sep + "out" + FileSystem.sep + "web").catch()
                                                    }, 2000)
                                                })
                                                .catch(() => alert.pushAlert("Error during packaging process", "error"))
                                        }
                                    }]
                                },
                                {
                                    label: "Help",
                                    options: [
                                        {
                                            label: "Editor Shortcuts",
                                            onClick: () => ipcRenderer.send("open-shortcuts", {})
                                        },
                                        {
                                            label: "About",
                                            icon: "help",
                                            disabled: true
                                        },

                                    ]
                                }
                            ]}
                            hasLogo={true}
                            pageInfo={events}
                            label={meta?.name}/>
                        <ContextWrapper
                            wrapperClassName={styles.context}
                            triggers={contextMenuHook[0].triggers}
                            className={styles.wrapper}
                            content={(selected, close) => <ContextMenu options={contextMenuHook[0].options} engine={engine} close={close} selected={selected} target={contextMenuHook[0].target}/>}
                        >
                            <Header options={options}/>
                            <div className={styles.viewportWrapper} id={props.id + "-editor-wrapper"}>
                                <Viewport
                                    utils={utils}
                                    id={id}
                                    executingAnimation={engine.executingAnimation}

                                    engine={engine}
                                    allowDrop={true}
                                />
                                <View
                                    content= {[
                                        {
                                            title: "Hierarchy",
                                            icon: "account_tree",
                                            headerOptions:(
                                                <Button className={styles.button} onClick={() => createFolder()}>
                                                    <Icon styles={{fontSize: "1rem"}}>create_new_folder</Icon>
                                                </Button>
                                            ),

                                            content: (
                                                <Hierarchy
                                                    executingAnimation={engine.executingAnimation}
                                                    engine={engine}
                                                    operationUtils={utils}
                                                />
                                            )
                                        },
                                        {
                                            title: "Component editor",
                                            icon: "category",
                                            headerOptions:[],
                                            content: <ComponentEditor engine={engine}/>
                                        }
                                    ]}
                                    orientation={"vertical"}
                                /> 
                            </div>
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
                                                id={id}
                                            />
                                        )
                                    },
                                    ...tabs
                                ]}
                            />
                        </ContextWrapper>
                        <Shortcuts/>
                    </SettingsProvider.Provider>
                </EntitiesProvider.Provider>
            </OpenFileProvider.Provider>
        </ContextMenuProvider.Provider>
    )
}

Editor.propTypes={
    load: PropTypes.object,
    quickAccess: PropTypes.object,
    pushSettingsBlock: PropTypes.func,
    id: PropTypes.string,
    meta: PropTypes.object,
    events: PropTypes.object,
    initialized: PropTypes.bool,
    setInitialized: PropTypes.func,
    settings: PropTypes.object
}