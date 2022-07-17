import GIZMOS from "../../../static/misc/GIZMOS"
import COMPONENTS from "../../../engine/data/COMPONENTS"
import Picking from "../../../engine/systems/misc/Picking"
import Conversion from "../../../engine/utils/Conversion"

const MAX_TIMESTAMP = 350, MAX_DELTA = 50

function pickIcon(cameraMesh, pickSystem, camera, coords) {
    return pickSystem.pickElement((shader, proj) => {
        const entities = Array.from(window.renderer.entitiesMap.values())
        for (let m = 0; m < entities.length; m++) {
            const currentInstance = entities[m]
            if (entities[m].active) {
                let t = currentInstance.components[COMPONENTS.TRANSFORM]?.transformationMatrix
                if (!t)
                    t = currentInstance.components[COMPONENTS.DIRECTIONAL_LIGHT]?.transformationMatrix
                if (t && !currentInstance.components[COMPONENTS.MESH])
                    Picking.drawMesh(currentInstance.components[COMPONENTS.CAMERA] ? cameraMesh : pickSystem.mesh, currentInstance, camera.viewMatrix, proj, t, shader)
            }
        }
    }, {x: coords[0], y: coords[1]}, camera)
}

function pickMesh(meshesMap, x, y) {
    const w = window.gpu.canvas.width, h = window.gpu.canvas.height
    const coords = Conversion.toQuadCoord({x, y}, {w, h})
    const picked = window.renderer.picking.depthPick(window.renderer.renderingPass.depthPrePass.frameBuffer, coords)
    return Math.round((picked[1] + picked[2]) * 255)
}

export default function onViewportClick(event, settings, setSelected) {
    const renderer = window.renderer
    if (settings.gizmo !== GIZMOS.CURSOR) {
        const deltaX = Math.abs(event.currentTarget.startedCoords.x - event.clientX)
        const deltaY = Math.abs(event.currentTarget.startedCoords.y - event.clientY)
        const elapsed = (performance.now() - event.currentTarget.started)

        if (window.gpu.canvas === event.target && elapsed <= MAX_TIMESTAMP && deltaX < MAX_DELTA && deltaY < MAX_DELTA) {
            const camera = renderer.camera
            const p = renderer.picking
            const cameraMesh = renderer.editorSystem.billboardSystem.cameraMesh
            const meshesMap = renderer.data.meshesMap
            const target = event.currentTarget.getBoundingClientRect()
            const coords = [event.clientX - target.left, event.clientY - target.top]

            let picked = pickIcon(cameraMesh, p, camera, coords)
            if (!picked)
                picked = pickMesh(meshesMap, event.clientX, event.clientY)
            if (picked > 0) {
                const entities = Array.from(window.renderer.entitiesMap.values())
                const entity = entities.find(e => e.components[COMPONENTS.PICK]?.pickIndex === picked)
                if (entity) setSelected(prev => {
                    const i = prev.findIndex(e => e === entity.id)
                    if (i > -1) {
                        prev.splice(i, 1)
                        return prev
                    }
                    if (event.ctrlKey) return [...prev, entity.id]
                    else return [entity.id]
                })
            } else
                setSelected([])
        }
    } else
        event.currentTarget.started = undefined

}