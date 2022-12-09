import Engine from "../../../../../public/engine/Engine";
import GPU from "../../../../../public/engine/GPU";

import STATIC_SHADERS from "../../../../../public/engine/static/resources/STATIC_SHADERS";
import getPivotPointMatrix from "../utils/get-pivot-point-matrix";
import CameraAPI from "../../../../../public/engine/lib/utils/CameraAPI";
import COMPONENTS from "../../../../../public/engine/static/COMPONENTS";

const attr = {
    translation: [0, 0, 0],
    sameSize: false,
    highlight: false,
    scale: [.25, .25, .25],
    attributes: [1, 1]
}
let iconsShader, iconsUniforms

export default class IconsSystem {
    static iconsTexture
    static shader


    static initialize() {

        IconsSystem.shader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.UNSHADED)
        iconsShader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.ICONS)
        iconsUniforms = iconsShader.uniformMap
    }

    static drawIcons() {
        if (!IconsSystem.iconsTexture)
            return

        iconsShader.bind()
        gpu.activeTexture(gpu.TEXTURE0)
        gpu.bindTexture(gpu.TEXTURE_2D, IconsSystem.iconsTexture)
        // TODO - ADD TO VIEWPORT SETTINGS
        gpu.uniform1f(iconsUniforms.scale, 1.)

        const tracking = CameraAPI.trackingEntity
        const entities = Engine.entities
        const size = entities.length
        for (let i = 0; i < size; i++) {
            const entity = entities[i]
            if (!entity._active)
                continue
            const hasSpotLight = entity.__hasSpotLight
            const hasPointLight = entity.__hasPointLight
            const hasDirectionalLight = entity.__hasDirectionalLight
            const hasSkylight = entity.__hasSkylight
            const hasCamera = entity.__hasCamera
            if (
                !hasSpotLight ||
                !hasPointLight ||
                !hasDirectionalLight ||
                !hasSkylight ||
                !hasCamera || tracking === entity
            )
                continue
            let index = 0
            let hasMore = false
            if (!hasDirectionalLight)
                index = 1
            if (hasPointLight) {
                hasMore = index !== 0
                index = 2
            }
            if (!hasSkylight) {
                hasMore = index !== 0
                index = 3
            }
            if (hasSpotLight) {
                hasMore = index !== 0
                index = 4
            }
            if (!hasCamera) {
                hasMore = index !== 0
                index = 5
            }

            gpu.uniform1f(iconsUniforms.imageIndex, hasMore ? 0 : index)
            getPivotPointMatrix(entity)
            gpu.uniform1i(iconsUniforms.isSelected, entity.__isSelected ? 1 : 0)
            gpu.uniformMatrix4fv(iconsUniforms.transformationMatrix, false, entity.__cacheIconMatrix)
            drawQuad()
        }


    }


}