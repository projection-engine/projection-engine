import GPUManager from "@engine-core/managers/GPUManager";
import Terrain from "@engine-core/lib/resources/Terrain";

export default class TerrainProcessor {
    static #initialized = false
    static #worker: Worker

    static initialize() {
        if (TerrainProcessor.#initialized)
            return
        TerrainProcessor.#initialized = true
        TerrainProcessor.#worker = new Worker("./terrain-worker.js")
    }

    static async generate(id: string, base64: string): Promise<Terrain | null> {
        const result: {data: TerrainProcessorResult} | null = await new Promise(resolve => {
            TerrainProcessor.#worker.postMessage({base64})
            TerrainProcessor.#worker.onmessage = resolve
            TerrainProcessor.#worker.onerror = () => resolve(null)
        })
        if (result.data != null) {
            return GPUManager.allocateTerrain(id, result.data)
        }
        return null
    }
}
