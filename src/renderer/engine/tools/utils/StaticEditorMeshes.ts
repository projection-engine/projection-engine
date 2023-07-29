import Mesh from "../../core/instances/Mesh"

import Texture from "../../core/instances/Texture"
import IconsSystem from "../icons/IconsSystem"

export default class StaticEditorMeshes {
	static #initialized = false

	static dualAxisGizmo?: Mesh
	static rotationGizmo?: Mesh
	static scaleGizmo?: Mesh
	static translationGizmo?: Mesh
	static clipSpaceCamera?: Mesh
	static camera?: Mesh


	static async initialize() {
		if (StaticEditorMeshes.#initialized)
			return
		StaticEditorMeshes.#initialized = true
		try {
			const res = await fetch("./STATIC_GIZMO_DATA.json")

			const {TRANSLATION_MESH, ROTATION_MESH, SCALE_MESH, DUAL_AXIS_MESH} = await res.json()
			StaticEditorMeshes.dualAxisGizmo = new Mesh(DUAL_AXIS_MESH)
			StaticEditorMeshes.rotationGizmo = new Mesh(ROTATION_MESH)
			StaticEditorMeshes.scaleGizmo = new Mesh(SCALE_MESH)
			StaticEditorMeshes.translationGizmo = new Mesh(TRANSLATION_MESH)

			const image = <Response> await fetch("./image.base64").catch(console.error)
			if (image !== undefined) {
				const t = new Texture(crypto.randomUUID())
				await t.initialize({img: await image.text()})
				IconsSystem.iconsTexture = t.texture
			}
		} catch (err) {
			console.error(err)
		}

		const positions = [
			-1, -1, -1,
			1, -1, -1,
			-1, 1, -1,
			1, 1, -1,
			-1, -1, 1,
			1, -1, 1,
			-1, 1, 1,
			1, 1, 1,
		]
		const indices = [
			0, 1, 1, 3, 3, 2, 2, 0,
			4, 5, 5, 7, 7, 6, 6, 4,
			0, 4, 1, 5, 3, 7, 2, 6,
		]
		StaticEditorMeshes.clipSpaceCamera = new Mesh({
			indices,
			vertices: positions
		})


	}
}
