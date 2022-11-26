import COMPONENTS from "../../../../public/engine/static/COMPONENTS.js";
import GPU from "../../../../public/engine/GPU";
import STATIC_MESHES from "../../../../public/engine/static/resources/STATIC_MESHES";
import Engine from "../../../../public/engine/Engine";

import STATIC_SHADERS from "../../../../public/engine/static/resources/STATIC_SHADERS";
import VisibilityBuffer from "../../../../public/engine/runtime/rendering/VisibilityBuffer";

export default function drawIconsToBuffer() {
    const entities = Engine.entities
    const FBO = VisibilityBuffer.buffer
    FBO.use()
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
    FBO.stop()
}

function drawIcon(mesh, meshID, transformMatrix) {
    const shader = GPU.shaders.get(STATIC_SHADERS.PRODUCTION.VISIBILITY_BUFFER)
    const uniforms = shader.uniformMap

    shader.bind()

    gpu.uniform3fv(uniforms.entityID, meshID)
    gpu.uniformMatrix4fv(uniforms.modelMatrix, false, transformMatrix)
    mesh.simplifiedDraw()
}