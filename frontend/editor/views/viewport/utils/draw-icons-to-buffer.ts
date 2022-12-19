import GPU from "../../../../../engine-core/GPU";
import STATIC_MESHES from "../../../../../engine-core/static/resources/STATIC_MESHES";
import Engine from "../../../../../engine-core/Engine";
import VisibilityRenderer from "../../../../../engine-core/runtime/VisibilityRenderer";
import StaticFBOsController from "../../../../../engine-core/lib/StaticFBOsController";
import StaticShadersController from "../../../../../engine-core/lib/StaticShadersController";

export default function drawIconsToBuffer() {
    const entities = Engine.entities

    StaticFBOsController.visibility.use()
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
    StaticFBOsController.visibility.stop()
    VisibilityRenderer.needsUpdate = true
}

function drawIcon(mesh, meshID, transformMatrix) {
    const uniforms = StaticShadersController.visibilityUniforms
    StaticShadersController.visibility.bind()
    GPU.context.uniform3fv(uniforms.entityID, meshID)
    GPU.context.uniformMatrix4fv(uniforms.modelMatrix, false, transformMatrix)
    mesh.simplifiedDraw()
}