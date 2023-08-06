import GPU from "../GPU"
import ResourceEntityMapper from "../resource-libs/ResourceEntityMapper"
import StaticShaders from "../lib/StaticShaders"
import StaticMeshes from "../lib/StaticMeshes"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import GPUUtil from "../utils/GPUUtil";
import EditorEntity from "../../tools/EditorEntity";
import AbstractSystem from "../AbstractSystem";
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/EntityManager";
import TransformationComponent from "@engine-core/components/TransformationComponent";
import SpriteComponent from "@engine-core/components/SpriteComponent";
import CullingComponent from "@engine-core/components/CullingComponent";

export default class SpriteRenderer extends AbstractSystem{
    shouldExecute(): boolean {
        return ResourceEntityMapper.withComponent(Components.SPRITE).size > 0
    }

    execute() {
        const sprites = ResourceEntityMapper.withComponent(Components.SPRITE).array
        const size = sprites.length
        const context = GPU.context
        StaticShaders.sprite.bind()
        context.activeTexture(context.TEXTURE0)
        for (let i = 0; i < size; i++) {
            this.#render(sprites[i])
        }
        MetricsController.currentState = METRICS_FLAGS.SPRITE
        context.enable(context.CULL_FACE)
    }

    #render(entity: EngineEntity) {
        const components = EntityManager.getAllComponentsMap(entity)
        const culling = components.get(Components.CULLING) as CullingComponent
        const sprite = components.get(Components.SPRITE) as SpriteComponent
        const transform = components.get(Components.TRANSFORMATION) as TransformationComponent
        if (!transform || culling.isDistanceCulled || !EntityManager.isEntityEnabled(entity) || culling?.isScreenDoorEnabled)
            return
        const context = GPU.context
        const uniforms = StaticShaders.spriteUniforms
        const texture = GPU.textures.get(sprite.imageID)
        if (!texture)
            return

        context.uniformMatrix4fv(uniforms.transformationMatrix, false, transform.matrix)
        context.uniform3fv(uniforms.scale, transform.scaling)
        context.uniform2fv(uniforms.attributes, sprite.attributes)

        GPUUtil.bind2DTextureForDrawing(uniforms.iconSampler, 0, texture.texture)
        StaticMeshes.drawQuad()
    }
}
