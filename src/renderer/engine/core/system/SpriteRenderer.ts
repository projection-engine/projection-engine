import GPUState from "../states/GPUState"
import StaticShadersState from "../states/StaticShadersState"
import StaticMeshesState from "../states/StaticMeshesState"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import SpriteComponent from "@engine-core/lib/components/SpriteComponent";
import CullingComponent from "@engine-core/lib/components/CullingComponent";

export default class SpriteRenderer extends AbstractSystem{
     shouldExecute = (): boolean =>  {
        return EntityManager.withComponent(Components.SPRITE).size > 0
    }

     execute = () => {
        const sprites = EntityManager.withComponent(Components.SPRITE).array
        const size = sprites.length
        const context = GPUState.context
        StaticShadersState.sprite.bind()
        context.activeTexture(context.TEXTURE0)
        for (let i = 0; i < size; i++) {
            this.#render(sprites[i])
        }
        context.enable(context.CULL_FACE)
    }

    #render(entity: EngineEntity) {
        const components = EntityManager.getAllComponentsMap(entity)
        const culling = components.get(Components.CULLING) as CullingComponent
        const sprite = components.get(Components.SPRITE) as SpriteComponent
        const transform = components.get(Components.TRANSFORMATION) as TransformationComponent
        if (!transform || culling.isDistanceCulled || !EntityManager.isEntityEnabled(entity))
            return
        const uniforms = StaticShadersState.spriteUniforms
        const texture = GPUState.textures.get(sprite.imageID)
        if (!texture)
            return

        const context = GPUState.context
        context.uniformMatrix4fv(uniforms.transformationMatrix, false, transform.matrix)
        context.uniform3fv(uniforms.scale, transform.scaling)
        context.uniform2fv(uniforms.attributes, sprite.attributes)

        GPUUtil.bind2DTextureForDrawing(uniforms.iconSampler, 0, texture.texture)
        StaticMeshesState.drawQuad()
    }
}
