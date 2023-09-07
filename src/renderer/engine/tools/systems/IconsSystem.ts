import GPUState from "@engine-core/states/GPUState"
import CameraManager from "@engine-core/managers/CameraManager"
import LineRenderer from "./LineRenderer"
import StaticMeshesState from "@engine-core/states/StaticMeshesState"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import {mat4} from "gl-matrix"
import EditorEntity from "../EditorEntity"
import StaticFBOState from "@engine-core/states/StaticFBOState"
import EngineToolsState from "../EngineToolsState"
import GizmoUtil from "../gizmo/util/GizmoUtil"
import GPUUtil from "../../core/utils/GPUUtil";
import AbstractSystem from "../../core/AbstractSystem";
import {Components, LightTypes,} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import LightComponent from "@engine-core/lib/components/LightComponent";
import IconsManager from "../IconsManager";


type CallbackFunc = (icon: RegisteredIcon, U?: { [key: string]: WebGLUniformLocation }) => void
export default class IconsSystem extends AbstractSystem {
    static iconsTexture?: WebGLTexture
    static #iconAttributes = mat4.create()

    static loop(cb: CallbackFunc, uniforms?: { [key: string]: WebGLUniformLocation }) {
        const icons = IconsManager.getIcons()
        const size = icons.length
        for (let i = 0; i < size; i++) {
            cb(icons[i], uniforms)
        }
    }

    static drawIcon(icon: RegisteredIcon, U?: { [key: string]: WebGLUniformLocation }) {
        const entity = icon.entity as EditorEntity
        if (entity == null) {
            return
        }

        const uniforms = U ?? StaticEditorShaders.iconUniforms
        const context = GPUState.context
        const {
            imageIndex,
            doNotFaceCamera,
            drawSphere,
            removeSphereCenter,
            scale
        } = icon

        const isSelected = entity.__isSelected ? 1 : 0
        const color = entity._colorIdentifier
        const iconAttributes = IconsSystem.#iconAttributes

        iconAttributes[0] = doNotFaceCamera
        iconAttributes[1] = drawSphere
        iconAttributes[2] = removeSphereCenter
        iconAttributes[3] = scale

        iconAttributes[4] = imageIndex
        iconAttributes[5] = isSelected

        iconAttributes[8] = color[0]
        iconAttributes[9] = color[1]
        iconAttributes[10] = color[2]

        GizmoUtil.createTransformationCache(entity)
        if (uniforms.entityID !== undefined)
            context.uniform3fv(uniforms.entityID, EntityManager.getEntityPickVec3(entity.id))

        context.uniformMatrix4fv(uniforms.settings, false, iconAttributes)
        context.uniformMatrix4fv(uniforms.transformationMatrix, false, entity.__cacheIconMatrix)
        StaticMeshesState.drawQuad()
    }

    static #drawVisualizations(icon: RegisteredIcon) {
        const entity = icon.entity as EditorEntity
        if (entity == null) {
            return
        }
        const hasLight = entity.hasComponent(Components.LIGHT)
        const hasCamera = entity.hasComponent(Components.CAMERA)
        if (!hasCamera && !hasLight)
            return

        const component = entity.getComponent<LightComponent>(Components.LIGHT)
        let lineSize = -50
        if (!hasCamera && hasLight) {
            switch (component.type) {
                case LightTypes.DISK:
                case LightTypes.SPOT:
                    lineSize = component.cutoff * 4
                    break
                case LightTypes.SPHERE:
                case LightTypes.POINT:
                    lineSize = -component.cutoff * 4
                    break
            }
        }
        LineRenderer.setState(!entity.__isSelected, true, lineSize)
        if (hasLight) {
            if (component.type === LightTypes.SPOT)
                LineRenderer.drawZ(entity.__cacheIconMatrix)
            else
                LineRenderer.drawY(entity.__cacheIconMatrix)
        }
        if (hasCamera) {
            LineRenderer.drawZ(entity.__cacheIconMatrix)
        }
    }

    shouldExecute = (): boolean => {
        return IconsSystem.iconsTexture != null
    }

    execute = () => {
        const context = GPUState.context
        const uniforms = StaticEditorShaders.iconUniforms
        StaticEditorShaders.icon.bind()

        GPUUtil.bind2DTextureForDrawing(uniforms.iconSampler, 0, IconsSystem.iconsTexture)

        GPUUtil.bind2DTextureForDrawing(uniforms.sceneDepth, 1, StaticFBOState.sceneDepthVelocity)

        context.uniformMatrix4fv(uniforms.projectionM, false, CameraManager.projectionMatrix)
        context.uniformMatrix4fv(uniforms.viewM, false, CameraManager.viewMatrix)

        if (EngineToolsState.showIcons)
            IconsSystem.loop(IconsSystem.drawIcon)
        if (EngineToolsState.showLines) {
            IconsSystem.loop(IconsSystem.#drawVisualizations)
        }
        LineRenderer.finish()
        context.enable(context.DEPTH_TEST)
        context.enable(context.CULL_FACE)
    }


}
