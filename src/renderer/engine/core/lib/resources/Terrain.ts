import VertexBuffer from "./VertexBuffer"

import GPUState from "../../states/GPUState"
import GPUManager from "../../managers/GPUManager"
import EngineState from "../../states/EngineState";
import AbstractMesh from "@engine-core/lib/resources/AbstractMesh";
import AssetResourceManager from "@engine-core/managers/AssetResourceManager";
import Texture from "@engine-core/lib/resources/Texture";

export default class Terrain extends AbstractMesh {
    draw() {
        this.bindAllResources()
        GPUState.context.drawElements(GPUState.context.TRIANGLES, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
    }
    getHeightMapTexture(): Texture | undefined{
        const texture = AssetResourceManager.getTexture(this.id)
        if (texture != null) {
            texture.lastUsed = this.lastUsed = EngineState.elapsed
        }
        return texture
    }
}
