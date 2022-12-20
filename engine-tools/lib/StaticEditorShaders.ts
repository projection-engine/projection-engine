import Controller from "../../engine-core/templates/Controller";
// @ts-ignore
import ICONS_SPRITE_VERT from "../shaders/ICONS_SPRITE.vert";
// @ts-ignore
import ICONS_SPRITE_FRAG from "../shaders/ICONS_SPRITE.frag";
// @ts-ignore
import LINE_VERT from "../shaders/LINE.vert";
// @ts-ignore
import LINE_FRAG from "../shaders/LINE.frag";
// @ts-ignore
import GIZMO_TO_DEPTH_VERT from "../shaders/GIZMO_TO_DEPTH.vert";
// @ts-ignore
import GIZMO_TO_DEPTH_FRAG from "../shaders/GIZMO_TO_DEPTH.frag";
// @ts-ignore
import GIZMO_VERT from "../shaders/GIZMO.vert";
// @ts-ignore
import GIZMO_FRAG from "../shaders/GIZMO.frag";
// @ts-ignore
import WIREFRAME_VERT from "../shaders/WIREFRAME.vert";
// @ts-ignore
import WIREFRAME_FRAG from "../shaders/WIREFRAME.frag";
// @ts-ignore
import ROTATION_GIZMO_VERT from "../shaders/ROTATION_GIZMO.vert";
// @ts-ignore
import ROTATION_GIZMO_FRAG from "../shaders/ROTATION_GIZMO.frag";
// @ts-ignore
import GRID_VERT from "../shaders/GRID.vert";
// @ts-ignore
import GRID_FRAG from "../shaders/GRID.frag";
// @ts-ignore
import SILHOUETTE_VERT from "../shaders/SILHOUETTE.vert";
// @ts-ignore
import SILHOUETTE_FRAG from "../shaders/SILHOUETTE.frag";
// @ts-ignore
import MESH_MAP_VERT from "../shaders/MESH_MAP.vert";
// @ts-ignore
import MESH_MAP_FRAG from "../shaders/MESH_MAP.frag";
import Shader from "../../engine-core/instances/Shader";

export default class StaticEditorShaders extends Controller {
    static icon?: Shader
    static line?: Shader
    static toDepthBuffer?: Shader
    static gizmo?: Shader
    static wireframe?: Shader
    static rotation?: Shader
    static grid?: Shader
    static silhouette?: Shader
    static outline?: Shader

    static iconUniforms?: { [key: string]: WebGLUniformLocation }
    static lineUniforms?: { [key: string]: WebGLUniformLocation }
    static toDepthBufferUniforms?: { [key: string]: WebGLUniformLocation }
    static gizmoUniforms?: { [key: string]: WebGLUniformLocation }
    static wireframeUniforms?: { [key: string]: WebGLUniformLocation }
    static rotationUniforms?: { [key: string]: WebGLUniformLocation }
    static gridUniforms?: { [key: string]: WebGLUniformLocation }
    static silhouetteUniforms?: { [key: string]: WebGLUniformLocation }
    static outlineUniforms?: { [key: string]: WebGLUniformLocation }

    static initialize() {
        super.initialize()

        StaticEditorShaders.icon = new Shader(ICONS_SPRITE_VERT, ICONS_SPRITE_FRAG)
        StaticEditorShaders.line = new Shader(LINE_VERT, LINE_FRAG)
        StaticEditorShaders.toDepthBuffer = new Shader(GIZMO_TO_DEPTH_VERT, GIZMO_TO_DEPTH_FRAG)
        StaticEditorShaders.gizmo = new Shader(GIZMO_VERT, GIZMO_FRAG)
        StaticEditorShaders.wireframe = new Shader(WIREFRAME_VERT, WIREFRAME_FRAG)
        StaticEditorShaders.rotation = new Shader(ROTATION_GIZMO_VERT, ROTATION_GIZMO_FRAG)
        StaticEditorShaders.grid = new Shader(GRID_VERT, GRID_FRAG)
        StaticEditorShaders.outline = new Shader(SILHOUETTE_VERT, SILHOUETTE_FRAG)
        StaticEditorShaders.silhouette = new Shader(MESH_MAP_VERT, MESH_MAP_FRAG)


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