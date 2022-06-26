import React, {useCallback} from "react"
import styles from "./styles/Project.module.css"
import SettingsProvider from "./providers/SettingsProvider"
import Frame from "../components/frame/Frame"
import useProjectWrapper from "./hooks/useProjectWrapper"
import PropTypes from "prop-types"
import Shortcuts from "./components/shortcuts/Shortcuts"
import ContextMenuProvider from "../components/context/hooks/ContextMenuProvider"
import useContextMenu from "../components/context/hooks/useContextMenu"
import ContextMenu from "../components/context/ContextMenu"
import {ContextWrapper} from "@f-ui/core"
import Viewport from "./components/viewport/Viewport"
import useEditorShortcuts from "./hooks/useEditorShortcuts"
import submitPackage from "./utils/submitPackage"
import Views from "../components/view/Views"
import useOptions from "./hooks/useOptions"
import useFiles from "./hooks/useFiles"
import FilesProvider from "./providers/FilesProvider"
import EngineProvider from "./providers/EngineProvider"
import BlueprintProvider from "./providers/BlueprintProvider"

const WORKER = new Worker(new URL("./engine-extension/cleanupWorker.js", import.meta.url))
export default function Editor(props) {
    const {id, meta, events,  settings, load} = props
    const { serializer, engine } = useProjectWrapper(id,   settings, props.pushSettingsBlock, load, WORKER)

    const contextMenuHook = useContextMenu()
    const utils = useEditorShortcuts({engine, settings, id, serializer})
    const options = useOptions(engine, serializer, settings)
    const filesHook = useFiles(engine)

    const submitMaterialPackage = useCallback((registryID, pack, matInstance) => {
        if(engine.initialized)
            submitPackage(pack, false, undefined, false, registryID, matInstance)
    }, [engine.initialized])


    return (
        <BlueprintProvider.Provider
            value={{
                selectedEntity: engine.selectedEntity,
                materials: engine.materials,
                setMaterials: engine.setMaterials,
                submitPackage: submitMaterialPackage
            }}
        >
            <EngineProvider.Provider value={[engine, utils]}>
                <FilesProvider.Provider  value={filesHook}>
                    <ContextMenuProvider.Provider value={contextMenuHook}>
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
                                    <Views
                                        setTabs={(tabs) => settings.leftView = tabs}
                                        tabs={settings.leftView}
                                        orientation={"vertical"}
                                        leftOffset={"10px"}
                                        resizePosition={"bottom"}
                                    />
                                    <Viewport
                                        utils={utils}
                                        id={id}
                                        executingAnimation={engine.executingAnimation}

                                        engine={engine}
                                        allowDrop={true}
                                    />
                                    <Views
                                        setTabs={(tabs) => settings.rightView = tabs}
                                        tabs={settings.rightView}
                                        orientation={"vertical"}
                                        leftOffset={"0%"}
                                        resizePosition={"top"}
                                    /> 
                                </div>
                                <Views
                                    setTabs={(tabs) => settings.bottomView = tabs}
                                    tabs={settings.bottomView}
                                    resizePosition={"top"}
                                    orientation={"horizontal"}
                                />
                            </ContextWrapper>
                            <Shortcuts/>
                        </SettingsProvider.Provider>
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