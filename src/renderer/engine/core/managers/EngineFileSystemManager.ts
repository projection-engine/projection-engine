import GPUState from "../states/GPUState"
import GPUManager from "./GPUManager"
import DynamicMap from "@engine-core/lib/DynamicMap";
import TerrainProcessor from "@engine-core/lib/math/TerrainProcessor";


export default class EngineFileSystemManager {
    static #callback: GenericNonVoidFunctionWithP<string, Promise<string>>
    static #fetching = new Map<string, boolean>()

    static async readAsset(assetID: string) {
        if (EngineFileSystemManager.#callback)
            return EngineFileSystemManager.#callback(assetID)
        return null
    }

    static requestTextureLoad(ID: string) {
        this.#doFetch(ID, GPUState.textures, async data => {
            const texture = JSON.parse(data)
            await GPUManager.allocateTexture({
                ...texture,
                img: texture.base64,
                yFlip: texture.flipY
            }, ID)
        })
    }

    static requestMeshLoad(ID: string) {
        this.#doFetch(ID, GPUState.meshes, async data => {
            GPUManager.allocateMesh(ID, JSON.parse(data))
        })
    }

    static requestMaterialLoad(ID: string) {
        this.#doFetch(ID, GPUState.materials, async data => {
            const file = JSON.parse(data)
            if (!file?.response) {
                return
            }
            await GPUManager.allocateMaterial(<MaterialInformation>file.response, ID)
        })
    }

    static #doFetch(id: string, resourceOrigin: DynamicMap<string, IResource>, onLoad: GenericNonVoidFunctionWithP<string, Promise<void>>) {
        const fetching = EngineFileSystemManager.#fetching;
        if (!id || fetching.get(id) || resourceOrigin.get(id) != null) {
            return
        }
        fetching.set(id, true)
        EngineFileSystemManager.readAsset(id)
            .then(data => {
                if (!data)
                    return
                onLoad(data).then(() => fetching.delete(id)).catch(console.error)
            })
            .catch(console.error)
    }

    static initialize(cb: GenericNonVoidFunctionWithP<string, Promise<string>>) {
        EngineFileSystemManager.#callback = cb
    }

    static requestTerrainLoad(ID: string) {
        this.#doFetch(ID, GPUState.terrains, async data => {
            try {
                const texture = JSON.parse(data)
                await TerrainProcessor.generate(ID, texture.base64)
            } catch (ex) {
                console.error(ex)
            }
        })
    }
}
