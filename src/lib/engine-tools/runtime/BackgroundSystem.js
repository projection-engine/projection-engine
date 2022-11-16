import Engine from "../../../../public/engine/Engine";
import CameraAPI from "../../../../public/engine/lib/utils/CameraAPI";
import Mesh from "../../../../public/engine/instances/Mesh";
import GPU from "../../../../public/engine/GPU";
import SkyboxPass from "../../../../public/engine/runtime/rendering/SkyboxPass";


export default class BackgroundSystem {
    static shader

    static execute() {
        if (SkyboxPass.hasRendered)
            return;
        const {gamma, background, backgroundColor} = Engine.params
        if (!background)
            return

        Mesh.finishIfUsed()
        gpu.depthMask(false)
        GPU.cubeBuffer.enable()
        BackgroundSystem.shader.bindForUse({
            skyboxProjectionMatrix: CameraAPI.skyboxProjectionMatrix,
            viewMatrix: CameraAPI.viewMatrix,
            gamma: gamma,
            color: backgroundColor,
            // debugSampler: OmnidirectionalShadows.cubeMaps[0].texture
        })
        gpu.drawArrays(gpu.TRIANGLES, 0, 36)
        GPU.cubeBuffer.disable()

        gpu.depthMask(true)

    }
}