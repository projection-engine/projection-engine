import React, {useMemo, useState} from "react"
import styles from "./styles/Project.module.css"
import {ENTITY_ACTIONS} from "./engine-extension/entityReducer"
import SettingsProvider from "./hooks/SettingsProvider"
import ContentBrowser from "./components/files/ContentBrowser"
import EntitiesProvider from "./hooks/EntitiesProvider"
import Frame from "../components/frame/Frame"
import useProjectWrapper from "./hooks/useProjectWrapper"
import FILE_TYPES from "../../public/static/FILE_TYPES"
import ViewTabs from "../components/view-tabs/ViewTabs"
import OpenFileProvider from "./hooks/OpenFileProvider"
import ShaderEditor from "./components/blueprints/ShaderEditor"
import PropTypes from "prop-types"
import Shortcuts from "./components/shortcuts/Shortcuts"
import ContextMenuProvider from "../components/context/hooks/ContextMenuProvider"
import useContextMenu from "../components/context/hooks/useContextMenu"
import ContextMenu from "../components/context/ContextMenu"
import {Button, ContextWrapper, Icon} from "@f-ui/core"
import Viewport from "./components/viewport/Viewport"
import useEditorShortcuts from "./hooks/useEditorShortcuts"
import submitPackage from "./utils/submitPackage"
import Hierarchy from "./components/hierarchy/Hierarchy"
import View from "../components/view/View"
import ComponentEditor from "./components/component/ComponentEditor"
import {createFolder} from "./components/hierarchy/utils/hiearchyUtils"
import Search from "../components/search/Search"
import useOptions from "./hooks/useOptions"
import FileSystem from "./utils/files/FileSystem"
import AsyncFS from "./templates/AsyncFS"
import SCRIPT_TEMPLATE from "./templates/SCRIPT_TEMPLATE"

const {shell} = window.require("electron")

export default function Editor(props) {
    const {id, meta, events,  settings, load} = props
    const {
        exporter,
        entitiesWithMeshes,
        serializer,
        engine, openTab, setOpenTab
    } = useProjectWrapper(id,   settings, props.pushSettingsBlock, load)
    const [openFiles, setOpenFiles] = useState([])
    const contextMenuHook = useContextMenu()
    const tabs = useMemo(() => [
        {
            label: "Files",
            icon: "folder",
            children: (
                <ContentBrowser
                    id={id}
                />
            )
        }, ...openFiles.map((o, i)=> ({
            label: o.label,
            icon: "texture",
            children: (
                <ShaderEditor
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
            }
        }))
    ], [openFiles, openTab, engine.entities, engine.selectedEntity])

    const utils = useEditorShortcuts({engine, settings, id, serializer})
    const [searchedEntity, setSearchedEntity] = useState("")
    const options = useOptions(
        engine.executingAnimation,
        engine.setExecutingAnimation,
        engine,
        () => {
            const path = document.fileSystem.path + FileSystem.sep + FILE_TYPES.LEVEL_SCRIPT
            AsyncFS.exists(path)
                .then(res=> {
                    if(!res)
                        document.fileSystem.writeFile(FileSystem.sep + FILE_TYPES.LEVEL_SCRIPT, SCRIPT_TEMPLATE)
                            .then(res => {
                                if(res) {
                                    document.fileSystem.refresh()
                                    shell.openPath(path).catch(() => alert.pushAlert("Error opening file", "error"))
                                }
                                else
                                    alert.pushAlert("Error creating file", "error")
                            })
                    else
                        shell.openPath(path).catch(() => alert.pushAlert("Error loading file", "error"))
                })
        },
        serializer,
        exporter
    )

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
                            options={options}
                            hasLogo={true}
                            pageInfo={events}
                            label={meta?.name}
                        />
                        <ContextWrapper
                            wrapperClassName={styles.context}
                            triggers={contextMenuHook[0].triggers}
                            className={styles.wrapper}
                            content={(selected, close) => <ContextMenu options={contextMenuHook[0].options} engine={engine} close={close} selected={selected} target={contextMenuHook[0].target}/>}
                        >
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
                                                <div style={{display: "flex", gap: "2px"}}>
                                                    <Search
                                                        width={"100%"}
                                                        searchString={searchedEntity}
                                                        setSearchString={setSearchedEntity}
                                                    />
                                                    <Button className={styles.button} onClick={() => createFolder()}>
                                                        <Icon styles={{fontSize: "1rem"}}>create_new_folder</Icon>
                                                    </Button>
                                                </div>
                                            ),

                                            content: (
                                                <Hierarchy
                                                    searchedEntity={searchedEntity}
                                                    engine={engine}
                                                    operationUtils={utils}
                                                />
                                            )
                                        },
                                        {
                                            title: engine.selectedEntity ? engine.selectedEntity.name : "Component editor",
                                            icon: "category",
                                            headerOptions: engine.selectedEntity ?(
                                                <Button
                                                    styles={{minHeight: "25px", minWidth: "25px"}}
                                                    onClick={() => engine.setLockedEntity(engine.lockedEntity === engine.selectedEntity.id ? undefined : engine.selectedEntity.id)}
                                                    className={styles.button}
                                                    variant={engine.lockedEntity === engine.selectedEntity.id ? "filled" : undefined}
                                                >
                                                    <Icon styles={{fontSize: "1rem"}}>push_pin</Icon>
                                                </Button>
                                            ) : null,
                                            content: <ComponentEditor engine={engine}/>
                                        }
                                    ]}
                                    orientation={"vertical"}
                                /> 
                            </div>
                            <ViewTabs
                                open={openTab}
                                setOpen={setOpenTab}
                                orientation={"vertical"}
                                tabs={tabs}
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
    settings: PropTypes.object
}