import GPU from "../../../../../engine-core/GPU";
import Engine from "../../../../../engine-core/Engine";
import VisibilityRenderer from "../../../../../engine-core/runtime/VisibilityRenderer";
import StaticFBO from "../../../../../engine-core/lib/StaticFBO";
import StaticShaders from "../../../../../engine-core/lib/StaticShaders";
import StaticMeshes from "../../../../../engine-core/lib/StaticMeshes";

export default function drawIconsToBuffer() {
    const entities = Engine.entities

    StaticFBO.visibility.use()
    const CUBE = StaticMeshes.cube
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        if (!entity.active || entity.__meshRef && (entity.__materialRef && !entity.__materialRef?.isSky  || !entity.__materialRef))
            continue
        drawIcon(
            CUBE,
            entity.pickID,
            entity.matrix,
        )
    }
    StaticFBO.visibility.stop()
    VisibilityRenderer.needsUpdate = true
}

function drawIcon(mesh, meshID, transformMatrix) {
    const uniforms = StaticShaders.visibilityUniforms
    StaticShaders.visibility.bind()
    GPU.context.uniform3fv(uniforms.entityID, meshID)
    GPU.context.uniformMatrix4fv(uniforms.modelMatrix, false, transformMatrix)
    mesh.simplifiedDraw()
}