import Engine from "../../../../public/engine/Engine";
import GPU from "../../../../public/engine/GPU";
import STATIC_MESHES from "../../../../public/engine/static/resources/STATIC_MESHES";

import STATIC_SHADERS from "../../../../public/engine/static/resources/STATIC_SHADERS";
import STATIC_TEXTURES from "../../../../public/engine/static/resources/STATIC_TEXTURES";
import SpritePass from "../../../../public/engine/runtime/rendering/SpritePass";
import GPUAPI from "../../../../public/engine/lib/rendering/GPUAPI";
import CameraAPI from "../../../../public/engine/lib/utils/CameraAPI";
import Wrapper from "../Wrapper";
import getPivotPointMatrix from "../utils/get-pivot-point-matrix";

const attr = {
    translation: [0, 0, 0],
    sameSize: false,
    highlight: false,
    scale: [.25, .25, .25],
    attributes: [1, 1]
}

const CAMERA_SCALE = [0.8578777313232422, 0.5202516317367554, 0.2847398519515991]
export default class IconsSystem {
    static cameraMesh
    static shader
    static textureOrange
    static textureYellow

    static initialize() {
        IconsSystem.cameraMesh = GPU.meshes.get(STATIC_MESHES.EDITOR.CAMERA)
        IconsSystem.shader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.UNSHADED)

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = 128
        canvas.height = 128

        // LOCKED ENTITY
        ctx.fillStyle = "rgb(255, 69, 0)"
        ctx.arc(64, 64, 10, 0, Math.PI * 2)
        ctx.fill()
        GPUAPI.allocateTexture(canvas.toDataURL(), STATIC_TEXTURES.PIXEL).then(texture => {
            IconsSystem.textureYellow = texture.texture
        })

        ctx.clearRect(0, 0, 128, 128)

        ctx.fillStyle = "yellow"
        ctx.arc(64, 64, 10, 0, Math.PI * 2)
        ctx.fill()
        GPUAPI.allocateTexture(canvas.toDataURL(), STATIC_TEXTURES.PIXEL_ORANGE).then(texture => {
            IconsSystem.textureOrange = texture.texture
        })
    }

    static drawIcons(selected) {
        const cameras = Engine.data.cameras


        for (let i = 0; i < cameras.length; i++) {
            const current = cameras[i]
            if (CameraAPI.trackingEntity === current)
                continue
            if (!current.active)
                continue
            attr.highlight = Wrapper.selectionMap.get(current.id) != null
            attr.transformMatrix = current.__cacheCenterMatrix
            IconsSystem.shader.bindForUse(attr)
            IconsSystem.cameraMesh.draw()
        }


    }
    static drawPoints(selected){
        gpu.clear(gpu.DEPTH_BUFFER_BIT)
        const size = selected.length
        for (let i = 0; i < size; i++) {
            const current = selected[i]
            if (!current)
                continue

            getPivotPointMatrix(current)
            attr.transformationMatrix = current.__cacheCenterMatrix
            attr.iconSampler = i === 0 ? IconsSystem.textureYellow : IconsSystem.textureOrange

            SpritePass.shader.bindForUse(attr)
            drawQuad()
        }
    }

}