import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
import EngineLoop from "../../../libs/engine/libs/loop/EngineLoop";

export default function drawIconsToBuffer() {
    const depthSystem = EngineLoop.renderMap.get("depthPrePass")
    const entities = Array.from(window.renderer.entitiesMap.values())
    const cameraMesh = window.renderer.cameraMesh
    const shader = depthSystem.shader

    shader.use()
    const FBO = depthSystem.frameBuffer
    FBO.startMapping(undefined, undefined, false)
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        if (entity.active) {

            const transformationMatrix = entity.components[COMPONENTS.TRANSFORM]?.transformationMatrix
            if (transformationMatrix && !entity.components[COMPONENTS.MESH])
                drawIcon(
                    entity.components[COMPONENTS.CAMERA] ? cameraMesh : window.renderer.cubeMesh,
                    entity.components[COMPONENTS.PICK].pickID,
                    transformationMatrix,
                    shader
                )

        }
    }
    FBO.stopMapping(false)
}

function drawIcon(mesh, meshID, transformMatrix, shader) {
    let gpu = window.gpu
    const camera = window.renderer.camera
    mesh.useForDepth()
    shader.bindForUse({
        meshID,
        projectionMatrix: camera.projectionMatrix,
        transformMatrix,
        viewMatrix: camera.viewMatrix
    })

    gpu.drawElements(gpu.TRIANGLES, mesh.verticesQuantity, gpu.UNSIGNED_INT, 0)
    mesh.finish()
}