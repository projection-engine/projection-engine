import COMPONENTS from "../../../../public/engine/static/COMPONENTS.js";
import GPU from "../../../../public/engine/GPU";
import STATIC_MESHES from "../../../../public/engine/static/resources/STATIC_MESHES";
import Engine from "../../../../public/engine/Engine";
import GBuffer from "../../../../public/engine/runtime/rendering/GBuffer";
import STATIC_SHADERS from "../../../../public/engine/static/resources/STATIC_SHADERS";

export default function drawIconsToBuffer() {
    const entities = Engine.entities
    const FBO = GBuffer.gBuffer
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
    const shader = GPU.shaders.get(STATIC_SHADERS.PRODUCTION.VISIBILITY_BUFFER)
    shader.bind()
    const uniforms = shader.uniformMap
    gpu.uniform3fv(uniforms.entityID, meshID)
    gpu.uniform1i(uniforms.materialID, 0)
    gpu.uniformMatrix4fv(uniforms.transformationMatrix, false, transformMatrix)
    mesh.draw()
}