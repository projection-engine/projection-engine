import GPU from "../GPU"
import VertexBuffer from "../instances/VertexBuffer"

import Mesh from "../instances/Mesh"
import GPUAPI from "../lib/rendering/GPUAPI"
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
			StaticMeshesState.sphere = GPUAPI.allocateMesh(EmbeddedMeshes.SPHERE, SPHERE)
			StaticMeshesState.cube = GPUAPI.allocateMesh(EmbeddedMeshes.CUBE, CUBE)
			StaticMeshesState.cylinder = GPUAPI.allocateMesh(EmbeddedMeshes.CYLINDER, CYLINDER)
			StaticMeshesState.plane = GPUAPI.allocateMesh(EmbeddedMeshes.PLANE, PLANE)
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
