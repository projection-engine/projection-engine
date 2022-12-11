import Engine from "../../../../../public/engine/Engine";
import GPU from "../../../../../public/engine/GPU";

import STATIC_SHADERS from "../../../../../public/engine/static/resources/STATIC_SHADERS";
import getPivotPointMatrix from "../utils/get-pivot-point-matrix";
import CameraAPI from "../../../../../public/engine/lib/utils/CameraAPI";
import COMPONENTS from "../../../../../public/engine/static/COMPONENTS";
import Wrapper from "../Wrapper";
import LineAPI from "../../../../../public/engine/lib/rendering/LineAPI";
import LightsAPI from "../../../../../public/engine/lib/rendering/LightsAPI";
import GizmoSystem from "./GizmoSystem";

const AXIS_Y = new Float32Array([0, 1, 0])
const AXIS_Z = new Float32Array([0, 0, 1])
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

    static loop(cb) {
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
                tracking === entity ||
                entity.__meshRef ||
                !hasSpotLight &&
                !hasPointLight &&
                !hasDirectionalLight &&
                !hasSkylight &&
                !hasCamera
            )
                continue
            cb(
                entity,
                hasSpotLight,
                hasPointLight,
                hasDirectionalLight,
                hasSkylight,
                hasCamera
            )
        }
    }

    static #drawIcon(
        entity,
        hasSpotLight,
        hasPointLight,
        hasDirectionalLight,
        hasSkylight,
        hasCamera
    ) {
        let index = 0
        let hasMore = false
        if (hasDirectionalLight)
            index = 1
        if (hasPointLight) {
            hasMore = index !== 0
            index = 2
        }
        if (hasSkylight) {
            hasMore = index !== 0
            index = 3
        }
        if (hasSpotLight) {
            hasMore = index !== 0
            index = 4
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
        hasSpotLight,
        hasPointLight,
        hasDirectionalLight,
        hasSkylight,
        hasCamera
    ) {
        if(hasSpotLight || hasPointLight || hasCamera)
            gpu.uniform1i(lineUniforms.darker, entity.__isSelected ? 0 : 1)

        let hasBound = false
        if (hasSpotLight) {
            hasBound = true
            const component = entity.components.get(COMPONENTS.SPOTLIGHT)
            gpu.uniform1f(lineUniforms.size, component.cutoff * 4)
            gpu.uniformMatrix4fv(lineUniforms.transformMatrix, false, entity.__cacheCenterMatrix)
            gpu.uniform3fv(lineUniforms.axis, AXIS_Y)
            LineAPI.drawY()
        }
        if (hasPointLight) {
            const component = entity.components.get(COMPONENTS.POINT_LIGHT)
            if(!hasBound) {
                gpu.uniformMatrix4fv(lineUniforms.transformMatrix, false, entity.__cacheCenterMatrix)
                gpu.uniform3fv(lineUniforms.axis, AXIS_Y)
            }
            gpu.uniform1f(lineUniforms.size, -component.cutoff * 4)
            LineAPI.drawY()
            hasBound = true
        }
        if (hasCamera){
            if(!hasBound)
                gpu.uniformMatrix4fv(lineUniforms.transformMatrix, false, entity.__cacheCenterMatrix)
            gpu.uniform1f(lineUniforms.size, -50)
            gpu.uniform3fv(lineUniforms.axis, AXIS_Z)
            LineAPI.drawZ()
        }
    }

    static drawIcons(settings) {
        if (!IconsSystem.iconsTexture)
            return

        iconsShader.bind()
        gpu.activeTexture(gpu.TEXTURE0)
        gpu.bindTexture(gpu.TEXTURE_2D, IconsSystem.iconsTexture)
        gpu.uniform1f(iconsUniforms.scale, settings.iconScale)
        IconsSystem.loop(IconsSystem.#drawIcon)


        lineShader.bind()
        gpu.uniform1i(lineUniforms.atOrigin, 1)
        IconsSystem.loop(IconsSystem.#drawVisualizations)

        gpu.clear(gpu.DEPTH_BUFFER_BIT)
    }


}