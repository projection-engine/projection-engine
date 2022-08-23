import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";
import LoopAPI from "../../../libs/engine/production/libs/apis/LoopAPI";
import RendererController from "../../../libs/engine/production/RendererController";
import CameraAPI from "../../../libs/engine/production/libs/apis/CameraAPI";
import EditorRenderer from "../../../libs/engine/editor/EditorRenderer";

export default function drawIconsToBuffer() {
    const depthSystem = LoopAPI.renderMap.get("depthPrePass")
    const entities = Array.from(RendererController.entitiesMap.values())
    const cameraMesh = EditorRenderer.cameraMesh
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
                    entity.components[COMPONENTS.CAMERA] ? cameraMesh : EditorRenderer.cubeMesh,
                    entity.pickID,
                    transformationMatrix,
                    shader
                )

        }
    }
    FBO.stopMapping(false)
}

function drawIcon(mesh, meshID, transformMatrix, shader) {
    mesh.useForDepth()
    shader.bindForUse({
        meshID,
        projectionMatrix: CameraAPI.projectionMatrix,
        transformMatrix,
        viewMatrix: CameraAPI.viewMatrix
    })

    mesh.draw()
}