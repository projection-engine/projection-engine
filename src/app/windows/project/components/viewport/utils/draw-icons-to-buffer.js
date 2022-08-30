import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";
import LoopController from "../../../libs/engine/production/controllers/LoopController";
import RendererController from "../../../libs/engine/production/controllers/RendererController";
import CameraAPI from "../../../libs/engine/production/libs/apis/CameraAPI";
import GPU from "../../../libs/engine/production/controllers/GPU";
import STATIC_MESHES from "../../../libs/engine/static/STATIC_MESHES";
import DepthPass from "../../../libs/engine/production/templates/passes/DepthPass";

export default function drawIconsToBuffer() {

    const entities = Array.from(RendererController.entitiesMap.values())

    const shader = DepthPass.shader
    const FBO = DepthPass.framebuffer
    FBO.startMapping(undefined, undefined, false)
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        if (entity.active) {
            const transformationMatrix = entity.transformationMatrix
            const comp = entity.components
            if (comp[COMPONENTS.POINT_LIGHT] || comp[COMPONENTS.PROBE] || comp[COMPONENTS.DIRECTIONAL_LIGHT])
                drawIcon(
                    GPU.meshes.get(entity.components[COMPONENTS.CAMERA] ? STATIC_MESHES.CAMERA : STATIC_MESHES.CUBE),
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