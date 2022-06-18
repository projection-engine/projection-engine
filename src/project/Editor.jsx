import React, {useMemo, useState} from "react"
import styles from "./styles/Project.module.css"
import SettingsProvider from "./providers/SettingsProvider"
import ContentBrowser from "./components/files/ContentBrowser"
import Frame from "../components/frame/Frame"
import useProjectWrapper from "./hooks/useProjectWrapper"
import ViewTabs from "../components/view-tabs/ViewTabs"
import OpenFileProvider from "./providers/OpenFileProvider"
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
import ViewWrapper from "../components/view/ViewWrapper"
import ComponentEditor from "./components/component/ComponentEditor"
import {createFolder} from "./components/hierarchy/utils/hiearchyUtils"
import Search from "../components/search/Search"
import useOptions from "./hooks/useOptions"
import useFiles from "./hooks/useFiles"
import FilesProvider from "./providers/FilesProvider"
import useHierarchy from "./hooks/useHierarchy"
import EngineProvider from "./providers/EngineProvider"
import BlueprintProvider from "./providers/BlueprintProvider"


export default function Editor(props) {
    const {id, meta, events,  settings, load} = props
    const {exporter, serializer, engine, openTab, setOpenTab} = useProjectWrapper(id,   settings, props.pushSettingsBlock, load)
    const [openFiles, setOpenFiles] = useState([])

    const contextMenuHook = useContextMenu()
    const tabs = useMemo(() => [
        {
            label: "Files",
            icon: "folder",
            children: (
                <ContentBrowser/>
            )
        },
        ...openFiles.map((o, i)=> ({
            label: o.label,
            icon: "texture",
            children: (
                <ShaderEditor
                    open={i === openTab}
                    registryID={o.registryID}
                    name={o.label}


                    engine={engine}
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
    const options = useOptions(engine, serializer, exporter)
    const filesHook = useFiles(engine)

    
    return (
        <BlueprintProvider.Provider
            value={{
                selected: engine.selected,
                entities: engine.entities,
                submitPackage: (registryID, pack, close, previewImage, isLevel, matInstance) => submitPackage(pack, close, previewImage, isLevel, registryID, matInstance, true, engine)
            }}
        >
            <EngineProvider.Provider value={[engine, utils]}>
                <FilesProvider.Provider  value={filesHook}>
                    <ContextMenuProvider.Provider value={contextMenuHook}>
                        <OpenFileProvider.Provider value={{openFiles, setOpenFiles, openTab, setOpenTab}}>
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
                                        <ViewWrapper
                                            content= {["hierarchy","component"]}
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
                        </OpenFileProvider.Provider>
                    </ContextMenuProvider.Provider>
                </FilesProvider.Provider>
            </EngineProvider.Provider>
        </BlueprintProvider.Provider>
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