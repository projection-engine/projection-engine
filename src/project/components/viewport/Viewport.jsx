import PropTypes from "prop-types"
import styles from "./styles/Viewport.module.css"
import React, {useContext, useEffect, useMemo, useRef, useState} from "react"
import GPUContextProvider from "./hooks/GPUContextProvider"
import useContextTarget from "../../../components/context/hooks/useContextTarget"
import RENDER_TARGET from "../../../static/misc/RENDER_TARGET"
import ViewportOptions from "./ViewportOptions"
import VerticalTabs from "../../../components/vertical-tab/VerticalTabs"
import SYSTEMS from "../../engine/templates/SYSTEMS"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import PickSystem from "../../engine/systems/PickSystem"
import SelectBox from "../../../components/select-box/SelectBox"
import Conversion from "../../engine/utils/Conversion"
import GIZMOS from "../../../static/misc/GIZMOS"
import SettingsProvider from "../../hooks/SettingsProvider"
import Transformation from "../../engine/templates/Transformation"
import cloneClass from "../../engine/utils/cloneClass"
import importData from "../../utils/importer/import"
import getOptionsViewport from "./getOptionsViewport"
import {updateTransform} from "../component/hooks/useForm"
import Transform from "../component/components/Transform"
import ViewportTab from "./components/ViewportTab"
import CameraTab from "./components/CameraTab"
import Camera from "./components/Camera"
import Gizmo from "./components/Gizmo"

const TRIGGERS = ["data-viewport"]
const MAX_TIMESTAMP = 350, MAX_DELTA = 50, LEFT_BUTTON = 0
const WORKER = new Worker(new URL("./hooks/findEntities.js", import.meta.url))
export default function Viewport(props) {

    const optionsViewport = useMemo(() => {
        const selected = props.engine.selected[0]
        const selectedRef = selected ? props.engine.entities.find(e => e.id === selected) : undefined
        return getOptionsViewport(props.engine, selected, selectedRef, props.utils)
    }, [props.engine.entities, props.engine.selected, props.utils.toCopy])

    const ref = useRef()
    const settings = useContext(SettingsProvider)
    const {bindGPU, gpu} = useContext(GPUContextProvider)
    useEffect(() => bindGPU(ref.current), [])
    function pickIcon (entities, cameraMesh, pickSystem, camera, coords){
        return pickSystem.pickElement((shader, proj) => {
            for (let m = 0; m < entities.length; m++) {
                const currentInstance = entities[m]
                if (entities[m].active) {
                    let t = currentInstance.components[COMPONENTS.TRANSFORM]?.transformationMatrix
                    if(!t)
                        t = currentInstance.components[COMPONENTS.DIRECTIONAL_LIGHT]?.transformationMatrix
                    if (t && !currentInstance.components[COMPONENTS.MESH])
                        PickSystem.drawMesh(currentInstance.components[COMPONENTS.CAMERA] ? cameraMesh : pickSystem.mesh, currentInstance, camera.viewMatrix, proj, t, shader, props.engine.gpu)
                }
            }
        }, {x: coords[0], y: coords[1]}, camera)
    }
    function pickMesh(meshSources, x, y){
        return  props.engine.renderer.systems[SYSTEMS.PICK].pickElement((shader, proj) => {
            for (let m = 0; m < props.engine.entities.length; m++) {
                const currentInstance = props.engine.entities[m]
                if (props.engine.entities[m].active) {
                    const t = currentInstance.components[COMPONENTS.TRANSFORM]?.transformationMatrix
                    if (t && currentInstance.components[COMPONENTS.MESH]) {
                        const mesh = meshSources[currentInstance.components[COMPONENTS.MESH]?.meshID]
                        if (mesh !== undefined) PickSystem.drawMesh(mesh, currentInstance, props.engine.renderer.camera.viewMatrix, proj, t, shader, props.engine.gpu)
                    }
                }
            }
        }, {x, y}, props.engine.renderer.camera)
    }
    function handler(event) {
        if(settings.gizmo !== GIZMOS.CURSOR) {
            const deltaX = Math.abs(event.currentTarget.startedCoords.x - event.clientX)
            const deltaY = Math.abs(event.currentTarget.startedCoords.y - event.clientY)
            const elapsed = (performance.now() - event.currentTarget.started)

            if (gpu.canvas === event.target && elapsed <= MAX_TIMESTAMP && deltaX < MAX_DELTA && deltaY < MAX_DELTA) {
                const camera = props.engine.renderer.camera
                const entities = props.engine.entities
                const p = props.engine.renderer.systems[SYSTEMS.PICK]
                const cameraMesh = props.engine.renderer.editorSystem.billboardSystem.cameraMesh
                const meshSources = props.engine.renderer.data.meshSources
                const target = event.currentTarget.getBoundingClientRect()
                const coords = [event.clientX - target.left, event.clientY - target.top]

                let picked = pickIcon(entities, cameraMesh, p, camera, coords)
                if (!picked)
                    picked = pickMesh(meshSources, coords[0], coords[1])
                if (picked > 0) {
                    const entity = entities.find(e => e.components[COMPONENTS.PICK]?.pickIndex === picked)

                    if (entity) props.engine.setSelected(prev => {
                        const i = prev.findIndex(e => e === entity.id)
                        if (i > -1) {
                            prev.splice(i, 1)
                            return prev
                        }
                        if (event.ctrlKey) return [...prev, entity.id]
                        else return [entity.id]
                    })
                } else
                    props.engine.setSelected([])
            }
        }else
            event.currentTarget.started = undefined
    }
    function updateCursor(coords){
        const t = props.engine.cursor.components[COMPONENTS.TRANSFORM]
        t.translation = coords
        t.transformationMatrix = Transformation.transform(t.translation, [0,0,0,1], t.scaling)
    }
    let latestTranslation
    function handleMouse(e){
        if(e.type === "mousemove"){
            const t = props.engine.cursor.components[COMPONENTS.TRANSFORM]
            latestTranslation =  Conversion.toScreen(e.clientX, e.clientY, gpu.canvas, props.engine.renderer.camera, t.translation).slice(0, 3)
            updateCursor(latestTranslation)
        }
        else{
            props.engine.setCursor(prev => {
                const clone = cloneClass(prev)
                clone.components[COMPONENTS.TRANSFORM].translation = latestTranslation
                clone.components[COMPONENTS.TRANSFORM].transformationMatrix = Transformation.transform(prev.components[COMPONENTS.TRANSFORM].translation, [0,0,0,1], [1,1,1])
                return clone
            })
            document.removeEventListener("mousemove", handleMouse)
        }
    }
    useContextTarget({id: "viewport-wrapper", label: "Viewport", icon: "window"}, optionsViewport, TRIGGERS)
    const [openSideBar, setOpenSideBar] = useState(false)

    return (
        <div className={styles.wrapper}>
            {props.engine.executingAnimation ?
                null
                :
                <ViewportOptions
                    engine={props.engine}
                    executingAnimation={props.executingAnimation}
                    id={props.id}
                />
            }
            <div
                onMouseDown={e => {
                    e.currentTarget.started = performance.now()
                    e.currentTarget.startedCoords = {x: e.clientX, y: e.clientY}
                    if(e.button === LEFT_BUTTON && settings.gizmo === GIZMOS.CURSOR && e.target === gpu.canvas || e.target === e.currentTarget){
                        latestTranslation = Conversion.toScreen(e.clientX, e.clientY, gpu.canvas, props.engine.renderer.camera, props.engine.cursor.components[COMPONENTS.TRANSFORM].translation).slice(0, 3)
                        updateCursor(latestTranslation)
                        document.addEventListener("mousemove", handleMouse)
                        document.addEventListener("mouseup", handleMouse, {once: true})
                    }
                }}
                onClick={handler}
                onDragOver={e => {
                    if (props.allowDrop) {
                        e.preventDefault()
                        ref.current?.classList.add(styles.hovered)
                    }
                }}
                onDragLeave={e => {
                    e.preventDefault()
                    ref.current?.classList.remove(styles.hovered)
                }}
                onDrop={e => {
                    if (props.allowDrop) {
                        e.preventDefault()
                        ref.current?.classList.remove(styles.hovered)
                        importData(e,  props.engine)
                    }
                }}
   
                data-viewport={RENDER_TARGET}
                id={"viewport-wrapper"}
                className={styles.viewport}
            >
                <canvas id={RENDER_TARGET} ref={ref} style={{width: "100%", height: "100%"}}/>
                {props.engine.executingAnimation ?
                    null
                    :
                    <>
                        <Gizmo/>
                        <Camera
                            engine={props.engine}
                            sideBarOpen={openSideBar}
                        />
                    </>
                }
                <VerticalTabs
                    open={openSideBar}
                    setOpen={setOpenSideBar}
                    absolute={true}
                    tabs={[
                        {
                            label: "Camera",
                            content: <CameraTab engine={props.engine}/>
                        },
                        {
                            label: "Viewport",
                            content: <ViewportTab engine={props.engine}/>
                        },
                        {
                            label: "Active entity",
                            disabled: !props.engine.selectedEntity,
                            content: props.engine.selectedEntity ? (
                                <Transform
                                    engine={props.engine} selected={props.engine.selectedEntity.components[COMPONENTS.TRANSFORM]} entityID={props.engine.selectedEntity.id}
                                    submitRotation={(axis, data) => updateTransform(axis, data, "rotation", props.engine, props.engine.selectedEntity.id)}
                                    submitScaling={(axis, data) => updateTransform(axis, data, "scaling", props.engine, props.engine.selectedEntity.id)}
                                    submitTranslation={(axis, data) => updateTransform(axis, data, "translation", props.engine, props.engine.selectedEntity.id)}
                                />
                            ) : null
                        }
                    ]}

                />
                <SelectBox
                    disabled={settings.gizmo === GIZMOS.CURSOR}
                    setSelected={(_, startCoords, endCoords) => {
                        if(startCoords && endCoords) {
                            const pickSystem = props.engine.renderer.systems[SYSTEMS.PICK]
                            const depthSystem = props.engine.renderer.systems[SYSTEMS.DEPTH_PRE_PASS]

                            const size = {
                                w: depthSystem.frameBuffer.width,
                                h: depthSystem.frameBuffer.height
                            }
                            const nStart = Conversion.toQuadCoord(startCoords, size, gpu.canvas)
                            const nEnd = Conversion.toQuadCoord(endCoords, size, gpu.canvas)

                            try{
                                const data = pickSystem.readBlock(depthSystem.frameBuffer, nStart, nEnd)
                                WORKER.postMessage({entities: props.engine.entities.map(e => e.pickerInfo()), data})
                                WORKER.onmessage = ({data: selected}) => props.engine.setSelected(selected)
                            }catch (err){
                                console.error(err, startCoords, nStart)
                            }
                        }
                    }}
                    target={RENDER_TARGET}
                    selected={[]}
                    nodes={[]}
                />
            </div>
        </div>
    )
}

Viewport.propTypes = {
    utils: PropTypes.object,
    allowDrop: PropTypes.bool.isRequired,
    executingAnimation: PropTypes.bool,
    engine: PropTypes.object,
    id: PropTypes.string,
    resolutionMultiplier: PropTypes.number
}