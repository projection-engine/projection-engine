import React, {useMemo} from "react"
import styles from "./styles/Project.module.css"
import SettingsProvider from "./context/SettingsProvider"
import Frame from "../components/frame/Frame"
import useProjectWrapper from "./hooks/useProjectWrapper"
import PropTypes from "prop-types"
import Viewport from "./components/viewport/Viewport"
import useEditorShortcuts from "./hooks/useEditorShortcuts"
import Views from "../components/view/Views"
import useFrameOptions from "./hooks/useFrameOptions"
import useFiles from "./hooks/useFiles"
import FilesProvider from "./context/FilesProvider"
import EngineProvider from "./context/EngineProvider"
import BlueprintProvider from "./context/BlueprintProvider"
import HierarchyProvider from "./context/HierarchyProvider"
import Context from "../components/context/Context"
import useSerializer from "./hooks/useSerializer"
import useViews from "./hooks/useViews"
import useQuickAccess from "./hooks/useQuickAccess"
import ContextProvider from "./components/ContextProvider"

export default function Editor(props) {
    const {id, meta, frameEvents, settings, load} = props
    const quickAccess = useQuickAccess()
    const engine = useProjectWrapper(id, settings, props.pushSettingsBlock, load)
    const serializer = useSerializer(settings)
    const utils = useEditorShortcuts({engine, settings, id, serializer})
    const frameOptions = useFrameOptions(engine, serializer, settings)
    const filesHook = useFiles(engine)

    const {view, updateView} = useViews(settings)

    return (
        <ContextProvider
            quickAccess={quickAccess}
            engine={engine}
            settings={settings}
            utils={utils}
            filesHook={filesHook}
        >
            <Frame
                logoAction={true}
                options={frameOptions}
                hasLogo={true}
                pageInfo={frameEvents}
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
                        topOffset={"23px"}
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
        </ContextProvider>
    )
}

Editor.propTypes = {
    load: PropTypes.object,
    pushSettingsBlock: PropTypes.func,
    id: PropTypes.string,
    meta: PropTypes.object,
    frameEvents: PropTypes.object,
    settings: PropTypes.object
}