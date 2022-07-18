import COMPONENTS from "../../../engine/data/COMPONENTS"

let gpu
export default function drawIconsToDepth() {
    gpu = window.gpu
    const entities = Array.from(window.renderer.entitiesMap.values())
    const cameraMesh = window.renderer.cameraMesh
    const shader = window.renderer.renderingPass.depthPrePass.shader

    shader.use()
    const FBO = window.renderer.renderingPass.depthPrePass.frameBuffer
    FBO.startMapping(undefined, undefined, false)
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        if (entity.active) {

            let transformationMatrix = entity.components[COMPONENTS.TRANSFORM]?.transformationMatrix
            if (!transformationMatrix)
                transformationMatrix = entity.components[COMPONENTS.DIRECTIONAL_LIGHT]?.transformationMatrix
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