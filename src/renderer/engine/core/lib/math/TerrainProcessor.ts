import GPUManager from "@engine-core/managers/GPUManager";
import Mesh from "@engine-core/lib/resources/Mesh";
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

    static async generate(base64: string, dimensions: number): Promise<Terrain | null> {
        const data: TerrainProcessorResult | null = await new Promise(resolve => {
            TerrainProcessor.#worker.postMessage({base64, dimensions})
            TerrainProcessor.#worker.onmessage = ({data}: { data: TerrainProcessorResult }) => resolve(data)
            TerrainProcessor.#worker.onerror = () => resolve(null)

        })
        if (data != null) {
            return GPUManager.allocateTerrain(crypto.randomUUID(), data)
        }
        return null
    }
}
