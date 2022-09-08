import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";
import CameraAPI from "../../../libs/engine/production/apis/CameraAPI";
import GPU from "../../../libs/engine/production/GPU";
import STATIC_MESHES from "../../../libs/engine/static/STATIC_MESHES";
import DepthPass from "../../../libs/engine/production/passes/DepthPass";

export default function drawIconsToBuffer() {
    const entities = window.renderer.entities
    const FBO = DepthPass.framebuffer
    FBO.startMapping(undefined, undefined, false)
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        if (!entity.active || !(entity.components[COMPONENTS.SPRITE] || entity.components[COMPONENTS.CAMERA]))
            continue
        drawIcon(
            GPU.meshes.get(entity.components[COMPONENTS.CAMERA] ? STATIC_MESHES.CAMERA : STATIC_MESHES.CUBE),
            entity.pickID,
            entity.transformationMatrix,
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