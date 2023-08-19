import GPU from "../GPU"
import GPUManager from "./GPUManager"


export default class EngineFileSystemManager {
	static #callback
	static #fetchingMaterials: { [key: string]: Function[] } = {}
	static #fetchingMeshes: { [key: string]: Function[] } = {}
	static ASSETS_PATH

	static get isReady() {
		return EngineFileSystemManager.#callback != null
	}

	/*
    Param can be either a registryID or an absolute path to the asset itself
     */
	static async readAsset(assetID: string) {
		if (EngineFileSystemManager.#callback)
			return EngineFileSystemManager.#callback(assetID)
		return null
	}

	static async loadTexture(registryID: string) {
		if (GPU.textures.get(registryID) != null)
			return
		try {
			const textureData = await EngineFileSystemManager.readAsset(registryID)
			if (textureData) {
				const data = JSON.parse(textureData)
				await GPUManager.allocateTexture({
					...data,
					img: data.base64,
					yFlip: data.flipY
				}, registryID)
			}
		} catch (err) {
			console.error(err)
		}
	}

	static async loadMesh(ID: string): Promise<boolean> {
		if (!ID || GPU.meshes.get(ID) != null) {
			EngineFileSystemManager.#doCallback(EngineFileSystemManager.#fetchingMeshes, ID)
			return
		}
		if (EngineFileSystemManager.#fetchingMeshes[ID])
			return await new Promise(resolve => {
				EngineFileSystemManager.#fetchingMeshes[ID].push(resolve)
			})
		else {
			EngineFileSystemManager.#fetchingMeshes[ID] = []

			try {
				if (!GPU.meshes.get(ID)) {
					const data = await EngineFileSystemManager.readAsset(ID)
					if (!data) {
						EngineFileSystemManager.#doCallback(EngineFileSystemManager.#fetchingMeshes, ID)
						return
					}
					const file = JSON.parse(data)
					GPUManager.allocateMesh(ID, file)
					EngineFileSystemManager.#doCallback(EngineFileSystemManager.#fetchingMeshes, ID)
					return
				}
			} catch (err) {
				console.error(err)
			}
			EngineFileSystemManager.#doCallback(EngineFileSystemManager.#fetchingMeshes, ID)
		}
	}

	static #doCallback(data: { [key: string]: Function[] }, id: string) {
		if (data[id])
			data[id].forEach(cb => cb())
		delete data[id]
	}

	static async loadMaterial(ID: string) {
		if (!ID || GPU.materials.get(ID) != null) {
			EngineFileSystemManager.#doCallback(EngineFileSystemManager.#fetchingMaterials, ID)
			return
		}
		if (EngineFileSystemManager.#fetchingMaterials[ID])
			return await new Promise(resolve => {

				EngineFileSystemManager.#fetchingMaterials[ID].push(resolve)
			})
		else {
			EngineFileSystemManager.#fetchingMaterials[ID] = []
			try {
				if (!GPU.materials.get(ID)) {
					const data = await EngineFileSystemManager.readAsset(ID)
					if (!data) {
						EngineFileSystemManager.#doCallback(EngineFileSystemManager.#fetchingMaterials, ID)
						return
					}
					const file = JSON.parse(data)
					if (!file?.response) {
						EngineFileSystemManager.#doCallback(EngineFileSystemManager.#fetchingMaterials, ID)
						return
					}
					const materialInformation = file.response
					if (materialInformation) {
						await GPUManager.allocateMaterial(<MaterialInformation>materialInformation, ID)
						EngineFileSystemManager.#doCallback(EngineFileSystemManager.#fetchingMaterials, ID)
						return
					}
				}
			} catch (err) {
				console.error(err)
			}
			EngineFileSystemManager.#doCallback(EngineFileSystemManager.#fetchingMaterials, ID)
		}
	}


	static initialize(cb: Function) {
		if (EngineFileSystemManager.isReady)
			return
		EngineFileSystemManager.#callback = cb
	}
}
