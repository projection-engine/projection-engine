import styles from "../../styles/Project.module.css"
import ViewportOptions from "../viewport/ViewportOptions"
import Viewport from "../viewport/Viewport"
import ResizableBar from "../../../components/resizable/ResizableBar"
import SceneView from "../scene/SceneView"
import React, {useContext, useMemo} from "react"
import QuickAccessProvider from "../../hooks/QuickAccessProvider"
import PropTypes from "prop-types"
import useEditorShortcuts from "./hooks/useEditorShortcuts"
import getOptionsViewport from "./utils/getOptionsViewport"
import importData from "../../utils/importer/import"

export default function Editor(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const utils = useEditorShortcuts(props)
    const optionsViewport = useMemo(() => {
        const selected = props.engine.selected[0]
        const selectedRef = selected ? props.engine.entities.find(e => e.id === selected) : undefined
        return getOptionsViewport(props.engine, selected, selectedRef, utils)
    }, [props.engine.entities, props.engine.selected, utils.toCopy])

    return (
        <div className={styles.viewportWrapper} id={props.id + "-editor-wrapper"}>
            <div id={"fullscreen-element-" + props.id}
                className={styles.container}>
                <ViewportOptions
                    engine={props.engine}
                    executingAnimation={props.executingAnimation}
                    id={props.id}
                    fullscreenID={"fullscreen-element-" + props.id}
                />
                <Viewport
                    utils={utils}
                    id={props.id}
                    options={optionsViewport}
                    engine={props.engine}
                    allowDrop={true}
                    handleDrop={e => importData(e, quickAccess.fileSystem, props.engine, props.setAlert, props.load)}
                />
            </div>
            <ResizableBar type={"width"}/>
            <SceneView
                executingAnimation={props.executingAnimation}

                setAlert={props.setAlert}
                engine={props.engine}
            />
        </div>
    )
}

Editor.propTypes = {
    load: PropTypes.object,
    setExecutingAnimation: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    executingAnimation: PropTypes.bool,
    engine: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    serializer: PropTypes.object.isRequired
}