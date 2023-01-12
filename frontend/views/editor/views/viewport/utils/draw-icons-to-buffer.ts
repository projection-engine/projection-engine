import GPU from "../../../../../../engine-core/GPU";
import StaticFBO from "../../../../../../engine-core/lib/StaticFBO";
import StaticEditorShaders from "../../../../../../engine-tools/lib/StaticEditorShaders";
import IconsSystem from "../../../../../../engine-tools/runtime/IconsSystem";
import SettingsStore from "../../../stores/SettingsStore";
import EntityComponentMapping from "../../../../../../engine-core/lib/EntityComponentMapping";
import StaticMeshes from "../../../../../../engine-core/lib/StaticMeshes";
import StaticShaders from "../../../../../../engine-core/lib/StaticShaders";
import CameraAPI from "../../../../../../engine-core/lib/utils/CameraAPI";

function drawDecalsToBuffer() {
    const entities = EntityComponentMapping.decals.array
    const uniforms = StaticShaders.visibilityUniforms
    const CUBE = StaticMeshes.cube
    const entityMetadata = new Float32Array(16)
    const context = GPU.context
    StaticShaders.visibility.bind()
    context.uniformMatrix4fv(uniforms.viewProjection, false, CameraAPI.viewProjectionMatrix)
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        if (!entity.active)
            continue
        entityMetadata[0] = entity.pickID[0]
        entityMetadata[1] = entity.pickID[1]
        entityMetadata[2] = entity.pickID[2]

        context.uniformMatrix4fv(uniforms.metadata, false, entityMetadata)
        context.uniformMatrix4fv(uniforms.modelMatrix, false, entity.matrix)
        CUBE.simplifiedDraw()
    }
}

export default function drawIconsToBuffer() {
    StaticFBO.visibility.startMapping(true)
    drawDecalsToBuffer()

    StaticEditorShaders.iconToDepth.bind()
    GPU.context.activeTexture(GPU.context.TEXTURE0)
    GPU.context.bindTexture(GPU.context.TEXTURE_2D, IconsSystem.iconsTexture)
    IconsSystem.loop(IconsSystem.drawIcon, SettingsStore.data, StaticEditorShaders.iconToDepthUniforms)

    StaticFBO.visibility.stop()
}
