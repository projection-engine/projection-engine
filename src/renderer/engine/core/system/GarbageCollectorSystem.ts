import GPUState from "../states/GPUState"
import AbstractSystem from "@engine-core/AbstractSystem";
import EngineState from "@engine-core/states/EngineState";
import GPUManager from "@engine-core/managers/GPUManager";


export default class GarbageCollectorSystem extends AbstractSystem {
    #THRESHOLD = 1000
    #lastExecution = 0

     shouldExecute = (): boolean =>  {
        return EngineState.elapsed - this.#lastExecution >= this.#THRESHOLD
    }

     execute = () => {
        const meshes = GPUState.meshes.array
        const textures = GPUState.textures.array

        for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i];
            if (mesh.loaded && EngineState.elapsed - mesh.lastUsed >= this.#THRESHOLD)
                GPUManager.destroyMesh(mesh)
        }

        for (let i = 0; i < textures.length; i++) {
            const texture = textures[i];
            if (texture.loaded && EngineState.elapsed - texture.lastUsed >= this.#THRESHOLD)
                GPUManager.destroyTexture(texture.id)
        }
        this.#lastExecution = EngineState.elapsed
    }
}
