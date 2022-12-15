import GPU from "../../../../../engine-core/GPU";
import STATIC_MESHES from "../../../../../engine-core/static/resources/STATIC_MESHES";
import Engine from "../../../../../engine-core/Engine";

import STATIC_SHADERS from "../../../../../engine-core/static/resources/STATIC_SHADERS";
import VisibilityRenderer from "../../../../../engine-core/runtime/rendering/VisibilityRenderer";
import STATIC_FRAMEBUFFERS from "../../../../../engine-core/static/resources/STATIC_FRAMEBUFFERS";

export default function drawIconsToBuffer() {
    const entities = Engine.entities
    const FBO = GPU.frameBuffers.get(STATIC_FRAMEBUFFERS.VISIBILITY_BUFFER)
    FBO.use()
    const CUBE = GPU.meshes.get(STATIC_MESHES.PRODUCTION.CUBE)
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        if (!entity.active || entity.__meshRef)
            continue
        drawIcon(
            CUBE,
            entity.pickID,
            entity.matrix,
        )
    }
    FBO.stop()
    VisibilityRenderer.needsUpdate = true
}

function drawIcon(mesh, meshID, transformMatrix) {
    const shader = GPU.shaders.get(STATIC_SHADERS.PRODUCTION.VISIBILITY_BUFFER)
    const uniforms = shader.uniformMap

    shader.bind()

    gpu.uniform3fv(uniforms.entityID, meshID)
    gpu.uniformMatrix4fv(uniforms.modelMatrix, false, transformMatrix)
    mesh.simplifiedDraw()
}