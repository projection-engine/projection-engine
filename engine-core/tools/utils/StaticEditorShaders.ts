import ICONS_SPRITE_VERT from "../static/shaders/ICONS_SPRITE.vert"
import ICONS_SPRITE_TO_DEPTH_VERT from "../static/shaders/ICONS_SPRITE_TO_DEPTH.vert"
import ICONS_SPRITE_FRAG from "../static/shaders/ICONS_SPRITE.frag"
import ICONS_SPRITE_TO_DEPTH_FRAG from "../static/shaders/ICONS_SPRITE_TO_DEPTH.frag"
import LINE_VERT from "../static/shaders/LINE.vert"
import LINE_FRAG from "../static/shaders/LINE.frag"
import GIZMO_TO_DEPTH_VERT from "../gizmo/shader/GIZMO_TO_DEPTH.vert"
import GIZMO_TO_DEPTH_FRAG from "../gizmo/shader/GIZMO_TO_DEPTH.frag"
import GIZMO_VERT from "../gizmo/shader/GIZMO.vert"
import GIZMO_FRAG from "../gizmo/shader/GIZMO.frag"
import WIREFRAME_VERT from "../static/shaders/WIREFRAME.vert"
import WIREFRAME_FRAG from "../static/shaders/WIREFRAME.frag"
import ROTATION_GIZMO_VERT from "../gizmo/shader/ROTATION_GIZMO.vert"
import ROTATION_GIZMO_FRAG from "../gizmo/shader/ROTATION_GIZMO.frag"
import GRID_VERT from "../static/shaders/GRID.vert"
import GRID_FRAG from "../static/shaders/GRID.frag"
import SILHOUETTE_VERT from "../static/shaders/SILHOUETTE.vert"
import SILHOUETTE_FRAG from "../static/shaders/SILHOUETTE.frag"
import MESH_MAP_VERT from "../static/shaders/MESH_MAP.vert"
import MESH_MAP_FRAG from "../static/shaders/MESH_MAP.frag"
import Shader from "../../core/instances/Shader"

export default class StaticEditorShaders {
	static icon?: Shader
	static line?: Shader
	static toDepthBuffer?: Shader
	static gizmo?: Shader
	static wireframe?: Shader
	static rotation?: Shader
	static grid?: Shader
	static silhouette?: Shader
	static outline?: Shader
	static iconToDepth?: Shader

	static iconToDepthUniforms?: { [key: string]: WebGLUniformLocation }
	static iconUniforms?: { [key: string]: WebGLUniformLocation }
	static lineUniforms?: { [key: string]: WebGLUniformLocation }
	static toDepthBufferUniforms?: { [key: string]: WebGLUniformLocation }
	static gizmoUniforms?: { [key: string]: WebGLUniformLocation }
	static wireframeUniforms?: { [key: string]: WebGLUniformLocation }
	static rotationUniforms?: { [key: string]: WebGLUniformLocation }
	static gridUniforms?: { [key: string]: WebGLUniformLocation }
	static silhouetteUniforms?: { [key: string]: WebGLUniformLocation }
	static outlineUniforms?: { [key: string]: WebGLUniformLocation }

	static #initialized = false

	static initialize() {
		if (StaticEditorShaders.#initialized)
			return
		StaticEditorShaders.#initialized = true

		StaticEditorShaders.icon = new Shader(ICONS_SPRITE_VERT, ICONS_SPRITE_FRAG)
		StaticEditorShaders.iconToDepth = new Shader(ICONS_SPRITE_TO_DEPTH_VERT, ICONS_SPRITE_TO_DEPTH_FRAG)
		StaticEditorShaders.line = new Shader(LINE_VERT, LINE_FRAG)
		StaticEditorShaders.toDepthBuffer = new Shader(GIZMO_TO_DEPTH_VERT, GIZMO_TO_DEPTH_FRAG)
		StaticEditorShaders.gizmo = new Shader(GIZMO_VERT, GIZMO_FRAG)
		StaticEditorShaders.wireframe = new Shader(WIREFRAME_VERT, WIREFRAME_FRAG)
		StaticEditorShaders.rotation = new Shader(ROTATION_GIZMO_VERT, ROTATION_GIZMO_FRAG)
		StaticEditorShaders.grid = new Shader(GRID_VERT, GRID_FRAG)
		StaticEditorShaders.outline = new Shader(SILHOUETTE_VERT, SILHOUETTE_FRAG)
		StaticEditorShaders.silhouette = new Shader(MESH_MAP_VERT, MESH_MAP_FRAG)

		StaticEditorShaders.iconToDepthUniforms = StaticEditorShaders.iconToDepth.uniformMap
		StaticEditorShaders.iconUniforms = StaticEditorShaders.icon.uniformMap
		StaticEditorShaders.lineUniforms = StaticEditorShaders.line.uniformMap
		StaticEditorShaders.toDepthBufferUniforms = StaticEditorShaders.toDepthBuffer.uniformMap
		StaticEditorShaders.gizmoUniforms = StaticEditorShaders.gizmo.uniformMap
		StaticEditorShaders.wireframeUniforms = StaticEditorShaders.wireframe.uniformMap
		StaticEditorShaders.rotationUniforms = StaticEditorShaders.rotation.uniformMap
		StaticEditorShaders.gridUniforms = StaticEditorShaders.grid.uniformMap
		StaticEditorShaders.outlineUniforms = StaticEditorShaders.outline.uniformMap
		StaticEditorShaders.silhouetteUniforms = StaticEditorShaders.silhouette.uniformMap
	}
}