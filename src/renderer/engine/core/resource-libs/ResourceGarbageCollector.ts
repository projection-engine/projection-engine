import GPU from "../GPU"
import GPUAPI from "../lib/rendering/GPUAPI"
import MeshResourceMapper from "../lib/MeshResourceMapper"

export default class ResourceGarbageCollector {
	static #interval = null
	static #INTERVAL = 120000
	static start() {
		clearInterval(ResourceGarbageCollector.#interval)
		ResourceGarbageCollector.#interval = setInterval(ResourceGarbageCollector.execute, ResourceGarbageCollector.#INTERVAL)
	}

	static stop() {
		clearInterval(ResourceGarbageCollector.#interval)
		ResourceGarbageCollector.#interval = null
	}

	static execute() {
		const meshes = GPU.meshes.array
		for (let i = 0; i < meshes.length; i++) {
			const current = meshes[i]
			const inUse = MeshResourceMapper.inUse.get(current.id)
			if (!inUse)
				GPUAPI.destroyMesh(current)
		}
	}
}
