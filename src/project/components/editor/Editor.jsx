import styles from "../../styles/Project.module.css"
import Viewport from "../viewport/Viewport"
import ResizableBar from "../../../components/resizable/ResizableBar"
import SceneView from "../scene/SceneView"
import React, {useMemo} from "react"
import PropTypes from "prop-types"
import useEditorShortcuts from "./hooks/useEditorShortcuts"
import getOptionsViewport from "./utils/getOptionsViewport"

export default function Editor(props) {
    const utils = useEditorShortcuts(props)
    const optionsViewport = useMemo(() => {
        const selected = props.engine.selected[0]
        const selectedRef = selected ? props.engine.entities.find(e => e.id === selected) : undefined
        return getOptionsViewport(props.engine, selected, selectedRef, utils)
    }, [props.engine.entities, props.engine.selected, utils.toCopy])

    return (
        <div className={styles.viewportWrapper} id={props.id + "-editor-wrapper"}>
            <Viewport
                utils={utils}
                id={props.id}
                executingAnimation={props.executingAnimation}
                options={optionsViewport}
                engine={props.engine}
                allowDrop={true}
            />

            <ResizableBar type={"width"}/>
            <SceneView
                executingAnimation={props.executingAnimation}
                engine={props.engine}
                operationUtils={utils}
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
    settings: PropTypes.object.isRequired,
    serializer: PropTypes.object.isRequired
}