import Framebuffer from "@engine-core/lib/resources/Framebuffer";
import GPUState from "@engine-core/states/GPUState";

export default class StaticEditorFBO {
	static gizmo?: Framebuffer
	static #initialized = false

	static initialize() {
		if (StaticEditorFBO.#initialized)
			return
		StaticEditorFBO.#initialized = true
		const context = GPUState.context
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
