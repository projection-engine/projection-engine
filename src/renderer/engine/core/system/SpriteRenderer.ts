import GPU from "../GPU"
import ResourceEntityMapper from "../resource-libs/ResourceEntityMapper"
import StaticShaders from "../lib/StaticShaders"
import StaticMeshes from "../lib/StaticMeshes"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import GPUUtil from "../utils/GPUUtil";
import Entity from "../instances/Entity";

export default class SpriteRenderer {
    execute() {
        const sprites = ResourceEntityMapper.sprites.array
        const size = sprites.length
        if (size > 0) {
            const context = GPU.context
            StaticShaders.sprite.bind()
            context.activeTexture(context.TEXTURE0)
            for (let i = 0; i < size; i++) {
                this.#render(sprites[i])
            }
            MetricsController.currentState = METRICS_FLAGS.SPRITE
            context.enable(context.CULL_FACE)
        }
    }

    #render(entity: Entity) {
        const context = GPU.context
        const component = entity.spriteComponent
        const uniforms = StaticShaders.spriteUniforms
        if (!entity.active || entity.isCulled) {
            return
        }
        const texture = GPU.textures.get(component.imageID)
        if (!texture) {
            return
        }

        context.uniformMatrix4fv(uniforms.transformationMatrix, false, entity.matrix)
        context.uniform3fv(uniforms.scale, entity._scaling)
        context.uniform2fv(uniforms.attributes, component.attributes)

        GPUUtil.bind2DTextureForDrawing(uniforms.iconSampler, 0, texture.texture)
        StaticMeshes.drawQuad()
    }
}
