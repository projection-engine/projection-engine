import React, {useEffect, useMemo} from "react"
import styles from "./styles/Project.module.css"
import SettingsProvider from "./providers/SettingsProvider"
import Frame from "../components/frame/Frame"
import useProjectWrapper from "./hooks/useProjectWrapper"
import PropTypes from "prop-types"
import Viewport from "./components/viewport/wrapper/Viewport"
import useEditorShortcuts from "./hooks/useEditorShortcuts"
import submitPackage from "./utils/submitPackage"
import Views from "../components/view/Views"
import useOptions from "./hooks/useOptions"
import useFiles from "./hooks/useFiles"
import FilesProvider from "./providers/FilesProvider"
import EngineProvider from "./providers/EngineProvider"
import BlueprintProvider from "./providers/BlueprintProvider"
import LayoutTabs from "./components/viewport/tabs/LayoutTabs"
import HierarchyProvider from "./providers/HierarchyProvider"
import Context from "../components/context/Context"


export default function Editor(props) {
    const {id, meta, events, settings, load} = props
    const {serializer, engine} = useProjectWrapper(id, settings, props.pushSettingsBlock, load)

    const utils = useEditorShortcuts({engine, settings, id, serializer})
    const options = useOptions(engine, serializer, settings)
    const filesHook = useFiles(engine)
    const view = useMemo(() => {
        return settings.views[settings.currentView]
    }, [settings.views, settings.currentView])
    const updateView = (key, newView) => {
        const copy = [...settings.views]
        copy[settings.currentView] = {...view, [key]: newView}
        settings.views = copy
    }

    useEffect(() => {
        // document.body.addEventListener("keydown", e => {
        //     e.preventDefault()
        // })
    }, [])

    return (
        <BlueprintProvider.Provider
            value={{
                selectedEntity: engine.selectedEntity,
                materials: engine.materials,
                setMaterials: engine.setMaterials,
                submitPackage,
                quickAccessMaterials: props.quickAccess.materials
            }}
        >
            <HierarchyProvider.Provider value={{
                dispatchEntities: engine.dispatchEntities,
                operationUtils: utils,
                setSelected: engine.setSelected,
                lockedEntity: engine.lockedEntity,
                setLockedEntity: engine.setLockedEntity,
                selected: engine.selected,
                entitiesChangeID: engine.entitiesChangeID
            }}>
                <EngineProvider.Provider value={[engine, utils]}>
                    <FilesProvider.Provider value={filesHook}>
                        <SettingsProvider.Provider value={settings}>
                            <Frame
                                logoAction={true}
                                options={options}
                                hasLogo={true}
                                pageInfo={events}
                                label={meta?.name}
                            />
                            <Context/>
                            <div className={styles.wrapper}>
                                <div className={styles.middle} id={props.id + "-editor-wrapper"}>
                                    <Views
                                        setTabs={(tabs) => updateView("left", tabs)}
                                        tabs={view.left}
                                        orientation={"vertical"}
                                        leftOffset={"10px"}
                                        resizePosition={"bottom"}
                                    />
                                    <div className={styles.viewportWrapper}>
                                        <LayoutTabs/>
                                        <Viewport
                                            utils={utils}
                                            id={id}
                                            executingAnimation={engine.executingAnimation}

                                            engine={engine}
                                            allowDrop={true}
                                        />
                                    </div>

                                    <Views
                                        setTabs={(tabs) => updateView("right", tabs)}
                                        tabs={view.right}
                                        orientation={"vertical"}
                                        leftOffset={"0%"}
                                        resizePosition={"top"}
                                    />
                                </div>
                                <Views
                                    setTabs={(tabs) => updateView("bottom", tabs)}
                                    tabs={view.bottom}
                                    resizePosition={"top"}
                                    orientation={"horizontal"}
                                />
                            </div>

                        </SettingsProvider.Provider>
                    </FilesProvider.Provider>
                </EngineProvider.Provider>
            </HierarchyProvider.Provider>
        </BlueprintProvider.Provider>
    )
}

Editor.propTypes = {
    load: PropTypes.object,
    quickAccess: PropTypes.object,
    pushSettingsBlock: PropTypes.func,
    id: PropTypes.string,
    meta: PropTypes.object,
    events: PropTypes.object,
    settings: PropTypes.object
}