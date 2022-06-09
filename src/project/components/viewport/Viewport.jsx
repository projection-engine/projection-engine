import PropTypes from "prop-types"
import styles from "./styles/Viewport.module.css"
import React, {useContext, useEffect, useRef} from "react"
import GPUContextProvider from "./hooks/GPUContextProvider"
import useContextTarget from "../../../components/context/hooks/useContextTarget"
import RENDER_TARGET from "../../../static/misc/RENDER_TARGET"
import ViewportOptions from "./ViewportOptions"
import SideBar from "./components/SideBar"
import SYSTEMS from "../../engine/templates/SYSTEMS"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import PickSystem from "../../engine/systems/PickSystem"

const TRIGGERS = ["data-viewport"]
export default function Viewport(props) {
    const ref = useRef()
    const {bindGPU, gpu} = useContext(GPUContextProvider)
    useEffect(() => bindGPU(ref.current), [])

    function handler(event) {
        if(gpu.canvas === event.target) {
            const camera = props.engine.renderer.camera
            const entities = props.engine.entities
            const p = props.engine.renderer.systems[SYSTEMS.PICK]
            const cameraMesh = props.engine.renderer.editorSystem.billboardSystem.cameraMesh
            const meshSources = props.engine.renderer.data.meshSources
            const target = event.currentTarget.getBoundingClientRect()
            const coords = [event.clientX - target.left, event.clientY - target.top]
            const pickID = p.pickElement((shader, proj) => {
                for (let m = 0; m < entities.length; m++) {
                    const currentInstance = entities[m]
                    if (entities[m].active) {
                        const t = currentInstance.components[COMPONENTS.TRANSFORM]
                        if (currentInstance.components[COMPONENTS.MESH]) {
                            const mesh = meshSources[currentInstance.components[COMPONENTS.MESH]?.meshID]
                            if (mesh !== undefined) PickSystem.drawMesh(mesh, currentInstance, camera.viewMatrix, proj, t.transformationMatrix, shader, props.engine.gpu)
                        } else if (t) PickSystem.drawMesh(currentInstance.components[COMPONENTS.CAMERA] ? cameraMesh : p.mesh, currentInstance, camera.viewMatrix, proj, t.transformationMatrix, shader, props.engine.gpu)
                    }
                }
            }, {x: coords[0], y: coords[1]}, camera)
            if (pickID > 0) {
                const entity = entities.find(e => e.components[COMPONENTS.PICK]?.pickID[0] * 255 === pickID)
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
    }

    useContextTarget({id: "viewport-wrapper", label: "Viewport", icon: "window"}, props.options, TRIGGERS)
    return (
        <div className={styles.wrapper}>
            <ViewportOptions
                engine={props.engine}
                executingAnimation={props.executingAnimation}
                id={props.id}
            />
            <div
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
                        props.handleDrop(e)
                    }
                }}
   
                data-viewport={RENDER_TARGET}
                id={"viewport-wrapper"}
                className={styles.viewport}
            >
                <span style={{display: "none"}} ref={ref}/>
                <SideBar engine={props.engine}/>
            </div>
        </div>
    )
}

Viewport.propTypes = {
    options: PropTypes.array,
    allowDrop: PropTypes.bool.isRequired,
    handleDrop: PropTypes.func,
    executingAnimation: PropTypes.bool,
    engine: PropTypes.object,
    id: PropTypes.string,
    resolutionMultiplier: PropTypes.number
}