import Engine from "../../engine-core/Engine";
import GPU from "../../engine-core/GPU";
import getPivotPointMatrix from "../utils/get-pivot-point-matrix";
import CameraAPI from "../../engine-core/lib/utils/CameraAPI";
import LIGHT_TYPES from "../../engine-core/static/LIGHT_TYPES";
import LineRenderer from "./LineRenderer";
import StaticMeshes from "../../engine-core/lib/StaticMeshes";
import StaticEditorShaders from "../lib/StaticEditorShaders";
import {mat4} from "gl-matrix";

const DEFAULT_COLOR = [255,255,255]

const iconAttributes = mat4.create()
export default class IconsSystem {
    static iconsTexture?: WebGLTexture

    static loop(cb, settings) {
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
            const doesntHaveIcon = !hasLight && !hasSkylight && !hasCamera
            if (
                tracking === entity ||
                entity.__meshRef && !entity.__materialRef?.isSky ||
                doesntHaveIcon && entity.__meshRef && !entity.__materialRef?.isSky
            )
                continue
            cb(
                entity,
                hasLight,
                hasSkylight,
                hasCamera,
                settings
            )
        }
    }

    static #drawIcon(
        entity,
        hasLight,
        hasSkylight,
        hasCamera,
        settings
    ) {
        const context = GPU.context
        const lightComponent = entity.__lightComp
        const lightType = lightComponent?.type
        const iconsUniforms = StaticEditorShaders.iconUniforms
        let doNotFaceCamera = 0,
            drawSphere = 0,
            removeSphereCenter = 0,
            scale = settings.iconScale,
            imageIndex = 0,
            isSelected = entity.__isSelected ? 1 : 0,
            color = entity._hierarchyColor||DEFAULT_COLOR

        switch (lightType) {
            case LIGHT_TYPES.DIRECTIONAL:
                imageIndex = 1
                break
            case LIGHT_TYPES.POINT:
                imageIndex = 2
                break
            case LIGHT_TYPES.SPOT:
                imageIndex = 4
                break
            case LIGHT_TYPES.SPHERE:
                imageIndex = -1
                drawSphere = 1
                scale = lightComponent.areaRadius
                removeSphereCenter = 0
                break
            case LIGHT_TYPES.DISK:
                imageIndex = -1
                doNotFaceCamera = 1
                drawSphere = 1
                removeSphereCenter = 1
                scale = lightComponent.areaRadius
                break
        }

        if (hasSkylight)
            imageIndex = imageIndex !== 0 ? 0 : 3

        if (hasCamera)
            imageIndex = imageIndex !== 0 ? 0 : 5


        iconAttributes[0] = doNotFaceCamera
        iconAttributes[1] = drawSphere
        iconAttributes[2] = removeSphereCenter
        iconAttributes[3] = scale

        iconAttributes[4] = imageIndex
        iconAttributes[5] = isSelected

        iconAttributes[8] = color[0]
        iconAttributes[9]= color[1]
        iconAttributes[10]= color[2]


        getPivotPointMatrix(entity)
        context.uniformMatrix4fv(iconsUniforms.settings, false, iconAttributes)
        context.uniformMatrix4fv(iconsUniforms.transformationMatrix, false, entity.__cacheIconMatrix)
        StaticMeshes.drawQuad()
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
        let lineSize = -50
        if (!hasCamera)
            switch (component.type) {
                case LIGHT_TYPES.DISK:
                case LIGHT_TYPES.SPOT:
                    lineSize = component.cutoff * 4
                    break
                case LIGHT_TYPES.SPHERE:
                case LIGHT_TYPES.POINT:
                    lineSize = -component.cutoff * 4
                    break
            }

        LineRenderer.setState(!entity.__isSelected, true, lineSize)
        if (hasLight)
            LineRenderer.drawY(entity.__cacheIconMatrix)
        if (hasCamera)
            LineRenderer.drawZ(entity.__cacheIconMatrix)
    }

    static drawIcons(settings) {
        if (!IconsSystem.iconsTexture)
            return

        StaticEditorShaders.icon.bind()
        GPU.context.activeTexture(GPU.context.TEXTURE0)
        GPU.context.bindTexture(GPU.context.TEXTURE_2D, IconsSystem.iconsTexture)

        if (settings.showIcons)
            IconsSystem.loop(IconsSystem.#drawIcon, settings)
        if (settings.showLines)
            IconsSystem.loop(IconsSystem.#drawVisualizations, settings)
        LineRenderer.finish()

    }


}