import Engine from "../../../../public/engine/Engine";
import GPU from "../../../../public/engine/GPU";

import STATIC_SHADERS from "../../../../public/engine/static/resources/STATIC_SHADERS";
import getPivotPointMatrix from "../utils/get-pivot-point-matrix";
import CameraAPI from "../../../../public/engine/lib/utils/CameraAPI";

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
        const data = Engine.data
        if (!IconsSystem.iconsTexture)
            return

        const pointLights = data.pointLights,
            directionalLights = data.directionalLights,
            spotLights = data.spotLights,
            cameras = data.cameras,
            skylights = data.skylights

        const pointLightsLength = pointLights.length,
            directionalLightsLength = directionalLights.length,
            spotLightLength = spotLights.length,
            camerasLength = cameras.length,
            skylightLength = skylights.length
        const tracking = CameraAPI.trackingEntity

        iconsShader.bind()
        gpu.activeTexture(gpu.TEXTURE0)
        gpu.bindTexture(gpu.TEXTURE_2D, IconsSystem.iconsTexture)
        gpu.uniform1i(iconsUniforms.image, 0)
        gpu.uniform1f(iconsUniforms.scale, window.scale || 1.)

        if (directionalLightsLength > 0)
            gpu.uniform1f(iconsUniforms.imageIndex, 1)
        for (let i = 0; i < directionalLightsLength; i++) {
            const current = directionalLights[i]
            if (!current.active)
                continue
            getPivotPointMatrix(current)

            gpu.uniform1i(iconsUniforms.isSelected, current.__isSelected ? 1 : 0)
            gpu.uniformMatrix4fv(iconsUniforms.transformationMatrix, false, current.__cacheIconMatrix)
            drawQuad()
        }

        if (pointLightsLength > 0)
            gpu.uniform1f(iconsUniforms.imageIndex, 2)
        for (let i = 0; i < pointLightsLength; i++) {
            const current = pointLights[i]
            if (!current.active)
                continue
            gpu.uniform1i(iconsUniforms.isSelected, current.__isSelected ? 1 : 0)
            getPivotPointMatrix(current)
            gpu.uniformMatrix4fv(iconsUniforms.transformationMatrix, false, current.__cacheIconMatrix)
            drawQuad()
        }

        if (skylightLength > 0)
            gpu.uniform1f(iconsUniforms.imageIndex, 3)
        for (let i = 0; i < skylightLength; i++) {
            const current = skylights[i]
            if (!current.active)
                continue
            gpu.uniform1i(iconsUniforms.isSelected, current.__isSelected ? 1 : 0)
            getPivotPointMatrix(current)
            gpu.uniformMatrix4fv(iconsUniforms.transformationMatrix, false, current.__cacheIconMatrix)
            drawQuad()
        }

        if (spotLightLength > 0)
            gpu.uniform1f(iconsUniforms.imageIndex, 4)
        for (let i = 0; i < spotLightLength; i++) {
            const current = spotLights[i]
            if (!current.active)
                continue
            gpu.uniform1i(iconsUniforms.isSelected, current.__isSelected ? 1 : 0)
            getPivotPointMatrix(current)
            gpu.uniformMatrix4fv(iconsUniforms.transformationMatrix, false, current.__cacheIconMatrix)
            drawQuad()
        }

        if (camerasLength > 0)
            gpu.uniform1f(iconsUniforms.imageIndex, 5)
        for (let i = 0; i < camerasLength; i++) {
            const current = cameras[i]
            if (!current.active || tracking === current)
                continue
            gpu.uniform1i(iconsUniforms.isSelected, current.__isSelected ? 1 : 0)
            getPivotPointMatrix(current)
            gpu.uniformMatrix4fv(iconsUniforms.transformationMatrix, false, current.__cacheIconMatrix)
            drawQuad()
        }
    }


}