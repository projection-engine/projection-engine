import GPU from "../GPU"
import VertexBuffer from "@engine-core/lib/resources/VertexBuffer"

import Mesh from "@engine-core/lib/resources/Mesh"
import GPUManager from "../managers/GPUManager"
import EmbeddedMeshes from "../static/EmbeddedMeshes"

export default class StaticMeshesState {
	static #initialized = false

	static quad?:Mesh
	static sphere?:Mesh
	static cube?:Mesh
	static cylinder?:Mesh
	static plane?:Mesh
	static cubeBuffer?:VertexBuffer

	static async initialize() {
		if(StaticMeshesState.#initialized)
			return
		StaticMeshesState.#initialized = true
		try {
			const res = await fetch("./STATIC_MESHES.json")
			const {QUAD, SPHERE, CUBE, CYLINDER, PLANE, CUBE_LINEAR} = await res.json()
			StaticMeshesState.sphere = GPUManager.allocateMesh(EmbeddedMeshes.SPHERE, SPHERE)
			StaticMeshesState.cube = GPUManager.allocateMesh(EmbeddedMeshes.CUBE, CUBE)
			StaticMeshesState.cylinder = GPUManager.allocateMesh(EmbeddedMeshes.CYLINDER, CYLINDER)
			StaticMeshesState.plane = GPUManager.allocateMesh(EmbeddedMeshes.PLANE, PLANE)
			StaticMeshesState.quad = new Mesh({...QUAD, id: "QUAD"})
			StaticMeshesState.cubeBuffer = new VertexBuffer(0, new Float32Array(CUBE_LINEAR), GPU.context.ARRAY_BUFFER, 3, GPU.context.FLOAT, false, undefined, 0)
		} catch (err) {
			console.error(err)
		}
	}
	static drawQuad(){
		const q = StaticMeshesState.quad
		const last = GPU.activeMesh
		if (last && last !== q)
			last.finish()
		q.bindEssentialResources()
		GPU.context.drawElements(GPU.context.TRIANGLES, q.verticesQuantity, GPU.context.UNSIGNED_INT, 0)
		GPU.activeMesh = q
	}
}
