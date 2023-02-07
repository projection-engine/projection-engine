import Engine from "../../engine-core/Engine";
import GPU from "../../engine-core/GPU";
import getPivotPointMatrix from "../utils/get-pivot-point-matrix";
import CameraAPI from "../../engine-core/lib/utils/CameraAPI";
import LIGHT_TYPES from "../../engine-core/static/LIGHT_TYPES";
import LineRenderer from "./LineRenderer";
import StaticMeshes from "../../engine-core/lib/StaticMeshes";
import StaticEditorShaders from "../lib/StaticEditorShaders";
import {mat4} from "gl-matrix";
import MATERIAL_RENDERING_TYPES from "../../engine-core/static/MATERIAL_RENDERING_TYPES";
import Entity from "../../engine-core/instances/Entity";
import MutableObject from "../../engine-core/static/MutableObject";
import StaticFBO from "../../engine-core/lib/StaticFBO";

const DEFAULT_COLOR = [255, 255, 255]

const iconAttributes = mat4.create()
export default class IconsSystem {
    static iconsTexture?: WebGLTexture

    static loop(cb, settings, uniforms?: MutableObject) {
        const tracking = CameraAPI.trackingEntity
        const entities = Engine.entities.array
        const size = entities.length

        for (let i = 0; i < size; i++) {
            const entity = entities[i]
            if (entity.isCollection || !entity.active || entity.spriteComponent !== undefined || entity.distanceFromCamera > settings.maxDistanceIcon )
                continue
            const hasLight = entity.lightComponent !== undefined
            const hasProbe = entity.lightProbeComponent !== undefined
            const hasCamera = entity.cameraComponent !== undefined
            const hasDecal = entity.cameraComponent !== undefined
            const hasAtmosphere = entity.cameraComponent !== undefined
            const doesntHaveIcon = !hasLight && !hasProbe && !hasCamera && !hasDecal && !hasAtmosphere

            if (
                tracking === entity ||
                doesntHaveIcon && entity.uiComponent ||
                entity.meshComponent?.hasMesh && entity.materialRef?.renderingMode !== MATERIAL_RENDERING_TYPES.SKY ||
                doesntHaveIcon && entity.meshComponent?.hasMesh && entity.materialRef?.renderingMode !== MATERIAL_RENDERING_TYPES.SKY
            )
                continue
            cb(entity, settings, uniforms)
        }
    }

    static drawIcon(
        entity: Entity,
        settings,
        U
    ) {
        const uniforms = U || StaticEditorShaders.iconUniforms
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


        // if (hasCamera)
        //     imageIndex = imageIndex !== 0 ? 0 : 5
        if (entity.lightProbeComponent)
            imageIndex = imageIndex !== 0 ? 0 : 3
        if (entity.atmosphereComponent)
            imageIndex = imageIndex !== 0 ? 0 : 5
        if (entity.decalComponent)
            imageIndex = imageIndex !== 0 ? 0 : 6
        // if (hasCamera)
        //     imageIndex = imageIndex !== 0 ? 0 : 5


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
        if (uniforms.entityID !== undefined)
            context.uniform3fv(uniforms.entityID, entity.pickID)

        context.uniformMatrix4fv(uniforms.settings, false, iconAttributes)
        context.uniformMatrix4fv(uniforms.transformationMatrix, false, entity.__cacheIconMatrix)
        StaticMeshes.drawQuad()
    }

    static #drawVisualizations(entity: Entity) {
        const hasLight = entity.lightComponent
        const hasCamera = entity.cameraComponent
        if (!hasCamera && !hasLight)
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
        if (hasLight) {
            if (component.type === LIGHT_TYPES.SPOT)
                LineRenderer.drawZ(entity.__cacheIconMatrix)
            else
                LineRenderer.drawY(entity.__cacheIconMatrix)
        }
        if (hasCamera)
            LineRenderer.drawZ(entity.__cacheIconMatrix)
    }

    static drawIcons(settings) {
        if (!IconsSystem.iconsTexture)
            return


        const context = GPU.context
        const uniforms = StaticEditorShaders.iconUniforms

        StaticEditorShaders.icon.bind()
        context.activeTexture(context.TEXTURE0)
        context.bindTexture(context.TEXTURE_2D, IconsSystem.iconsTexture)
        context.uniform1i(uniforms.iconSampler, 0)

        context.activeTexture(context.TEXTURE1)
        context.bindTexture(context.TEXTURE_2D, StaticFBO.sceneDepthVelocity)
        context.uniform1i(uniforms.sceneDepth, 1)

        context.uniformMatrix4fv(uniforms.projectionM, false, CameraAPI.projectionMatrix)
        context.uniformMatrix4fv(uniforms.viewM, false,  CameraAPI.viewMatrix)

        if (settings.showIcons)
            IconsSystem.loop(IconsSystem.drawIcon, settings)
        if (settings.showLines)
            IconsSystem.loop(IconsSystem.#drawVisualizations, settings)
        LineRenderer.finish()


    }


}