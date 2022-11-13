import COMPONENTS from "../../../../public/engine/static/COMPONENTS.js"
import CameraAPI from "../../../../public/engine/lib/utils/CameraAPI";
import GPU from "../../../../public/engine/GPU";
import STATIC_FRAMEBUFFERS from "../../../../public/engine/static/resources/STATIC_FRAMEBUFFERS";
import QueryAPI from "../../../../public/engine/lib/utils/QueryAPI";
import GPUAPI from "../../../../public/engine/lib/rendering/GPUAPI";


export default class SelectedSystem {
    static shaderSilhouette
    static shader
    static frameBuffer
    static silhouetteSampler

    static initialize() {

        SelectedSystem.frameBuffer = GPUAPI.allocateFramebuffer(STATIC_FRAMEBUFFERS.EDITOR.OUTLINE).texture({
            precision: gpu.R16F,
            format: gpu.RED,
            type: gpu.FLOAT
        })
        SelectedSystem.silhouetteSampler = SelectedSystem.frameBuffer.colors[0]
    }

    static drawToBuffer(selected) {
        const length = selected.length
        if (length === 0)
            return
        SelectedSystem.frameBuffer.startMapping()
        for (let m = 0; m < length; m++) {
            const current = selected[m]
            if (!current || !current.active)
                continue
            const components = current.components

            const mMeshID = components.get(COMPONENTS.MESH)?.meshID
            const tTerrainID = components.get(COMPONENTS.TERRAIN)?.terrainID

            const mesh = GPU.meshes.get(mMeshID || tTerrainID)
            if (!mesh)
                continue
            SelectedSystem.shader.bindForUse({
                meshIndex: m,
                transformMatrix: current.matrix,
            })
            mesh.draw()
        }
        SelectedSystem.frameBuffer.stopMapping()

    }

    static drawSilhouette(selected) {
        const length = selected.length
        if (length > 0) {
            SelectedSystem.shaderSilhouette.bindForUse({
                silhouette: SelectedSystem.silhouetteSampler
            })
            drawQuad()
        }
    }
}