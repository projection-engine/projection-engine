import Engine from "../../engine-core/Engine";
import GPU from "../../engine-core/GPU";
import getPivotPointMatrix from "../utils/get-pivot-point-matrix";
import CameraAPI from "../../engine-core/lib/utils/CameraAPI";
import LIGHT_TYPES from "../../engine-core/static/LIGHT_TYPES";
import LineRenderer from "./LineRenderer";
import StaticMeshes from "../../engine-core/lib/StaticMeshes";
import StaticEditorShaders from "../lib/StaticEditorShaders";
import {mat4} from "gl-matrix";

const DEFAULT_COLOR = [255, 255, 255]

const iconAttributes = mat4.create()
export default class IconsSystem {
    static iconsTexture?: WebGLTexture

    static loop(cb, settings, uniforms?: Object) {
        const tracking = CameraAPI.trackingEntity
        const entities = Engine.entities
        const size = entities.length

        for (let i = 0; i < size; i++) {
            const entity = entities[i]
            if (!entity.active || entity.spriteComponent !== undefined || entity.distanceFromCamera > settings.maxDistanceIcon)
                continue
            const hasLight = entity.lightComponent !== undefined
            const hasSkylight = entity.skylightComponent !== undefined
            const hasCamera = entity.cameraComponent !== undefined
            const doesntHaveIcon = !hasLight && !hasSkylight && !hasCamera
            if (
                tracking === entity ||
                entity.meshRef && !entity.materialRef?.isSky ||
                doesntHaveIcon && entity.meshRef && !entity.materialRef?.isSky ||
                doesntHaveIcon && entity.decalComponent?.imageID
            )
                continue
            cb(
                entity,
                hasLight,
                hasSkylight,
                hasCamera,
                settings,
                uniforms
            )
        }
    }

    static drawIcon(
        entity,
        hasLight,
        hasSkylight,
        hasCamera,
        settings,
        iconsUniforms
    ) {
        const context = GPU.context
        const lightComponent = entity.lightComponent
        const lightType = lightComponent?.type
        let doNotFaceCamera = 0,
            drawSphere = 0,
            removeSphereCenter = 0,
            scale = settings.iconScale,
            imageIndex = 0,
            isSelected = entity.__isSelected ? 1 : 0,
            color = entity._hierarchyColor || DEFAULT_COLOR

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
        iconAttributes[9] = color[1]
        iconAttributes[10] = color[2]


        getPivotPointMatrix(entity)
        if (iconsUniforms.entityID !== undefined)
            context.uniform3fv(iconsUniforms.entityID, entity.pickID)

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

        const component = entity.lightComponent
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
            IconsSystem.loop(IconsSystem.drawIcon, settings, StaticEditorShaders.iconUniforms)
        if (settings.showLines)
            IconsSystem.loop(IconsSystem.#drawVisualizations, settings)
        LineRenderer.finish()
    }


}