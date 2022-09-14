import COMPONENTS from "../../../../../public/engine/static/COMPONENTS.json";
import CameraAPI from "../../../../../public/engine/production/apis/camera/CameraAPI";
import GPU from "../../../../../public/engine/production/GPU";
import STATIC_MESHES from "../../../../../public/engine/static/resources/STATIC_MESHES";
import DepthPass from "../../../../../public/engine/production/passes/rendering/DepthPass";
import Engine from "../../../../../public/engine/production/Engine";

export default function drawIconsToBuffer() {
    const entities = Engine.entities
    const FBO = DepthPass.framebuffer
    FBO.startMapping(undefined, undefined, false)
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        if (!entity.active || !(entity.components.get(COMPONENTS.SPRITE) || entity.components.get(COMPONENTS.CAMERA)))
            continue
        drawIcon(
            GPU.meshes.get(entity.components.get(COMPONENTS.CAMERA) ? STATIC_MESHES.EDITOR.CAMERA : STATIC_MESHES.PRODUCTION.CUBE),
            entity.pickID,
            entity.matrix,
        )
    }

    FBO.stopMapping(false)
}

function drawIcon(mesh, meshID, transformMatrix) {

    DepthPass.shader.bindForUse({
        meshID,
        projectionMatrix: CameraAPI.projectionMatrix,
        transformMatrix,
        viewMatrix: CameraAPI.viewMatrix
    })
    mesh.draw()
}