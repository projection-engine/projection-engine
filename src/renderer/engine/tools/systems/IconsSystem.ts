import GPU from "../../core/GPU"
import CameraAPI from "../../core/lib/utils/CameraAPI"
import LineRenderer from "./LineRenderer"
import StaticMeshes from "../../core/lib/StaticMeshes"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import {mat4} from "gl-matrix"
import EditorEntity from "../EditorEntity"
import StaticFBO from "../../core/lib/StaticFBO"
import EngineToolsState from "../EngineToolsState"
import GizmoUtil from "../gizmo/util/GizmoUtil"
import GPUUtil from "../../core/utils/GPUUtil";
import AbstractSystem from "../../core/AbstractSystem";
import {Components, LightTypes, MaterialRenderingTypes,} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/EntityManager";
import EngineState from "@engine-core/EngineState";
import EditorEntityManager from "../EditorEntityManager";
import LightComponent from "@engine-core/components/LightComponent";
import MeshComponent from "@engine-core/components/MeshComponent";


export default class IconsSystem extends AbstractSystem {
    static iconsTexture?: WebGLTexture
    static #iconAttributes = mat4.create()

    static loop(cb, uniforms?: MutableObject) {
        const icons = EditorEntityManager.getIcons()
        const size = icons.length
        for (let i = 0; i < size; i++) {
            cb(icons[i], uniforms)
        }
    }

    static drawIcon(icon: RegisteredIcon, U) {
        const uniforms = U || StaticEditorShaders.iconUniforms
        const context = GPU.context
        const {
            imageIndex,
            doNotFaceCamera,
            drawSphere,
            removeSphereCenter,
            scale
        } = icon
        const entity = icon.entity as EditorEntity
        const isSelected = entity.__isSelected ? 1 : 0,
            color = entity._colorIdentifier

        const iconAttributes = this.#iconAttributes
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
        StaticMeshes.drawQuad()
    }

    static #drawVisualizations(entity: EditorEntity) {
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

    shouldExecute(): boolean {
        return IconsSystem.iconsTexture != null
    }

    execute() {
        const context = GPU.context
        const uniforms = StaticEditorShaders.iconUniforms
        StaticEditorShaders.icon.bind()

        GPUUtil.bind2DTextureForDrawing(uniforms.iconSampler, 0, IconsSystem.iconsTexture)

        GPUUtil.bind2DTextureForDrawing(uniforms.sceneDepth, 1, StaticFBO.sceneDepthVelocity)

        context.uniformMatrix4fv(uniforms.projectionM, false, CameraAPI.projectionMatrix)
        context.uniformMatrix4fv(uniforms.viewM, false, CameraAPI.viewMatrix)

        if (EngineToolsState.showIcons)
            IconsSystem.loop(IconsSystem.drawIcon)
        if (EngineToolsState.showLines)
            IconsSystem.loop(IconsSystem.#drawVisualizations)
        LineRenderer.finish()
        context.enable(context.DEPTH_TEST)
        context.enable(context.CULL_FACE)
    }


}
