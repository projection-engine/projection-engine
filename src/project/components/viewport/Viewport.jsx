import PropTypes from "prop-types"
import styles from "./styles/Viewport.module.css"
import React, {useContext, useEffect, useId, useMemo, useState} from "react"
import useContextTarget from "../../../components/context/hooks/useContextTarget"
import RENDER_TARGET from "../../static/misc/RENDER_TARGET"
import HeaderOptions from "./views/HeaderOptions"
import COMPONENTS from "../../engine/data/COMPONENTS"
import SelectBox from "../../../components/select-box/SelectBox"
import Conversion from "../../engine/utils/Conversion"
import GIZMOS from "../../static/misc/GIZMOS"
import SettingsProvider from "../../context/SettingsProvider"
import importData from "../../libs/importer/import"
import getOptionsViewport from "./utils/getOptionsViewport"
import windowBuilder from "../../engine/windowBuilder"
import EditorEngine from "../../engine-extension/EditorEngine"
import SideOptions from "./views/SideOptions"
import updateCursor from "./utils/updateCursor"
import onViewportClick from "./utils/onViewportClick"
import drawIconsToDepth from "./utils/drawIconsToDepth"

const TRIGGERS = ["data-viewport"]
const LEFT_BUTTON = 0
const WORKER = new Worker(new URL("./utils/findEntities.js", import.meta.url))

let gizmoSystem
export default function Viewport(props) {
    const renderer = window.renderer
    const settings = useContext(SettingsProvider)
    const internalID = useId()
    const optionsViewport = useMemo(
        () => getOptionsViewport(props.engine, props.utils),
        [props.engine.selected, props.utils]
    )
    const [rendererIsReady, setRendererIsReady] = useState(false)
    useContextTarget(internalID, optionsViewport, TRIGGERS)
    useEffect(() => {
        if (!props.engine.viewportInitialized) {
            const {
                gpu,
                imageWorker
            } = windowBuilder(document.getElementById(RENDER_TARGET), settings.resolution, EditorEngine)
            window.gpu = gpu
            window.imageWorker = imageWorker
            props.engine.setViewportInitialized(true)
        } else if (settings.INITIALIZED && !window.renderer) {
            window.renderer = new EditorEngine({w: settings.resolution[0], h: settings.resolution[1]})
            setRendererIsReady(true)
        }
    }, [settings])


    let latestTranslation

    function handleMouse(e) {
        if (e.type === "mousemove") {
            latestTranslation = Conversion.toScreen(e.clientX, e.clientY, renderer.camera).slice(0, 3)
            updateCursor(latestTranslation)
        } else
            document.removeEventListener("mousemove", handleMouse)
    }


    function gizmoMouseMove(event) {
        if (gizmoSystem && gizmoSystem.targetGizmo)
            gizmoSystem.targetGizmo.onMouseMove(event)
    }

    return (
        <>
            {props.engine.executingAnimation ? null : <HeaderOptions/>}
            <div
                onMouseDown={e => {
                    e.currentTarget.startedCoords = {x: e.clientX, y: e.clientY}
                    if (e.button === LEFT_BUTTON && settings.gizmo === GIZMOS.CURSOR && e.target === window.gpu.canvas || e.target === e.currentTarget) {
                        latestTranslation = Conversion.toScreen(e.clientX, e.clientY, renderer.camera, renderer.cursor.components[COMPONENTS.TRANSFORM].translation).slice(0, 3)
                        updateCursor(latestTranslation)
                        document.addEventListener("mousemove", handleMouse)
                        document.addEventListener("mouseup", handleMouse, {once: true})
                    }
                    if(e.button === LEFT_BUTTON && settings.gizmo !== GIZMOS.CURSOR) {
                        gizmoSystem = window.renderer.editorSystem.gizmoSystem
                        if (gizmoSystem.targetGizmo) {
                            gizmoSystem.targetGizmo.onMouseDown(e)
                            e.currentTarget.targetGizmo = gizmoSystem.targetGizmo
                            e.currentTarget.addEventListener("mousemove", gizmoMouseMove)
                        }
                    }
                }}
                onMouseUp={event => {
                    if (gizmoSystem && gizmoSystem.targetGizmo) {
                        gizmoSystem.targetGizmo.onMouseUp(event)
                        // gizmoSystem.targetGizmo = undefined
                        event.currentTarget.removeEventListener("mousemove", gizmoMouseMove)
                    }
                }}
                onClick={event => {
                    onViewportClick(event, settings, props.engine.setSelected, props.engine.selected)
                }}

                onDragOver={e => {
                    e.preventDefault()
                    e.currentTarget.classList.add(styles.hovered)
                }}
                onDragLeave={e => {
                    e.preventDefault()
                    e.currentTarget.classList.remove(styles.hovered)
                }}
                onDrop={e => {
                    // TODO - APPLY MATERIAL BY DROPPING IT ON MESH (PICK MESH AND LOAD MATERIAL)
                    e.preventDefault()
                    e.currentTarget.classList.remove(styles.hovered)
                    importData(e, props.engine)
                }}

                data-viewport={RENDER_TARGET}
                id={internalID}
                className={styles.viewport}
            >
                <canvas
                    id={RENDER_TARGET}
                    style={{width: "100%", height: "100%", background: "transparent"}}
                    width={settings.resolution[0]}
                    height={settings.resolution[1]}
                />
                {rendererIsReady ? (
                    <SideOptions
                        selectedEntity={props.engine.selectedEntity}
                        executingAnimation={props.engine.executingAnimation}
                    />
                ) : null}

                <SelectBox
                    targetElementID={RENDER_TARGET}
                    disabled={settings.gizmo === GIZMOS.CURSOR}
                    setSelected={(_, startCoords, endCoords) => {
                        if (startCoords && endCoords) {
                            drawIconsToDepth()
                            const depthFBO = renderer.renderingPass.depthPrePass.frameBuffer
                            const size = {
                                w: depthFBO.width,
                                h: depthFBO.height
                            }
                            const nStart = Conversion.toQuadCoord(startCoords, size)
                            const nEnd = Conversion.toQuadCoord(endCoords, size)

                            try {
                                const data = renderer.picking.readBlock(depthFBO, nStart, nEnd)
                                WORKER.postMessage({entities: renderer.entities, data})
                                WORKER.onmessage = ({data: selected}) => props.engine.setSelected(selected)
                            } catch (err) {
                                console.error(err, startCoords, nStart)
                            }
                        }
                    }}
                    target={RENDER_TARGET}
                    selected={[]}
                    nodes={[]}
                />
            </div>
        </>
    )
}

Viewport.propTypes = {
    utils: PropTypes.object,
    executingAnimation: PropTypes.bool,
    engine: PropTypes.object,
    id: PropTypes.string
}