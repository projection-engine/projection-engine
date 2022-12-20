import Mesh from "../../engine-core/instances/Mesh";

import Texture from "../../engine-core/instances/Texture";
import IconsSystem from "../runtime/IconsSystem";

export default class StaticEditorMeshes {
    static #initialized = false

    static dualAxisGizmo?:Mesh
    static rotationGizmo?:Mesh
    static scaleGizmo?:Mesh
    static translationGizmo?:Mesh

    static async initialize() {
        if (StaticEditorMeshes.#initialized)
            return
        StaticEditorMeshes.#initialized = true
        try {
            const res = await fetch("./STATIC_GIZMO_DATA.json")
            const {TRANSLATION_MESH, ROTATION_MESH, SCALE_MESH, DUAL_AXIS_MESH, ICON_IMG} = await res.json()
            StaticEditorMeshes.dualAxisGizmo    = new Mesh(DUAL_AXIS_MESH)
            StaticEditorMeshes.rotationGizmo    = new Mesh(ROTATION_MESH)
            StaticEditorMeshes.scaleGizmo       = new Mesh(SCALE_MESH)
            StaticEditorMeshes.translationGizmo = new Mesh(TRANSLATION_MESH)

            const t = new Texture()
            await t.initialize({img: ICON_IMG})
            IconsSystem.iconsTexture = t.texture
        } catch (err) {
            console.error(err)
        }
    }
}