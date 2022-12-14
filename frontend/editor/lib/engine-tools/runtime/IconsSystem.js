import Engine from "../../../../../public/engine/Engine";
import GPU from "../../../../../public/engine/GPU";

import STATIC_SHADERS from "../../../../../public/engine/static/resources/STATIC_SHADERS";
import getPivotPointMatrix from "../utils/get-pivot-point-matrix";
import CameraAPI from "../../../../../public/engine/lib/utils/CameraAPI";
import LineAPI from "../../../../../public/engine/lib/rendering/LineAPI";
import LIGHT_TYPES from "../../../../../public/engine/static/LIGHT_TYPES";
import LineRenderer from "./LineRenderer";


let lineShader, lineUniforms
let iconsShader, iconsUniforms

export default class IconsSystem {
    static iconsTexture
    static shader

    static initialize() {
        lineShader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.LINE)
        lineUniforms = lineShader.uniformMap
        IconsSystem.shader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.UNSHADED)
        iconsShader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.ICONS)
        iconsUniforms = iconsShader.uniformMap
    }

    static loop(cb, settings ) {
        const tracking = CameraAPI.trackingEntity
        const entities = Engine.entities
        const size = entities.length

        for (let i = 0; i < size; i++) {
            const entity = entities[i]


            if (!entity.active || entity.distanceFromCamera > settings.maxDistanceIcon)
                continue
            const hasLight = entity.__hasLight
            const hasSkylight = entity.__hasSkylight
            const hasCamera = entity.__hasCamera

            if (
                tracking === entity ||
                entity.__meshRef ||
                !hasLight &&
                !hasSkylight &&
                !hasCamera
            )
                continue
            cb(
                entity,
                hasLight,
                hasSkylight,
                hasCamera
            )
        }
    }

    static #drawIcon(
        entity,
        hasLight,
        hasSkylight,
        hasCamera
    ) {
        let index = 0
        let hasMore = false
        const lightComponent = entity.__lightComp
        const lightType = lightComponent?.type


        switch (lightType){
            case LIGHT_TYPES.DIRECTIONAL:
                index = 1
                break
            case LIGHT_TYPES.POINT:
                hasMore = index !== 0
                index = 2
                break
            case LIGHT_TYPES.SPOT:
                hasMore = index !== 0
                index = 4
                break
        }

        if (hasSkylight) {
            hasMore = index !== 0
            index = 3
        }

        if (hasCamera) {
            hasMore = index !== 0
            index = 5
        }

        gpu.uniform1f(iconsUniforms.imageIndex, hasMore ? 0 : index)
        getPivotPointMatrix(entity)
        gpu.uniform1i(iconsUniforms.isSelected, entity.__isSelected ? 1 : 0)
        gpu.uniformMatrix4fv(iconsUniforms.transformationMatrix, false, entity.__cacheIconMatrix)
        drawQuad()
    }

    static #drawVisualizations(
        entity,
        hasLight,
        hasSkylight,
        hasCamera
    ) {
        if (!hasLight && !hasCamera)
            return

        const component = entity.__lightComp
        const lineSize = hasCamera ? -50 : component.type === LIGHT_TYPES.SPOT ? 1 : -1 * component.cutoff * 4
        LineRenderer.setState(!entity.__isSelected, true, lineSize)

        if (hasLight)
            LineRenderer.drawY(entity.__cacheIconMatrix)
        if (hasCamera)
            LineRenderer.drawZ(entity.__cacheIconMatrix)
    }

    static drawIcons(settings) {
        if (!IconsSystem.iconsTexture)
            return

        iconsShader.bind()

        gpu.activeTexture(gpu.TEXTURE0)
        gpu.bindTexture(gpu.TEXTURE_2D, IconsSystem.iconsTexture)

        gpu.uniform1f(iconsUniforms.scale, settings.iconScale)

        IconsSystem.loop(IconsSystem.#drawIcon, settings)
        IconsSystem.loop(IconsSystem.#drawVisualizations, settings)
        LineRenderer.finish()

        gpu.clear(gpu.DEPTH_BUFFER_BIT)
    }


}