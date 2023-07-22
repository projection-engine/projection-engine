import Framebuffer from "../../core/instances/Framebuffer";
import GPU from "../../core/GPU";

export default class StaticEditorFBO {
	static gizmo?: Framebuffer
	static #initialized = false

	static initialize() {
		if (StaticEditorFBO.#initialized)
			return
		StaticEditorFBO.#initialized = true
		const context = GPU.context
		StaticEditorFBO.gizmo = (new Framebuffer())
			.texture({
				label: "GIZMO_ID",
				precision: context.RGBA,
				format: context.RGBA,
				type: context.UNSIGNED_BYTE
			})
			.depthTest()
	}
}
