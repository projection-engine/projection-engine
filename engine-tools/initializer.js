import STATIC_TEXTURES from "../engine-core/static/resources/STATIC_TEXTURES";
import STATIC_SHADERS from "../engine-core/static/resources/STATIC_SHADERS";
import * as gizmoShaderCode from "./shaders/GIZMO.glsl";
import STATIC_MESHES from "../engine-core/static/resources/STATIC_MESHES";

import Engine from "../engine-core/Engine";
import ENVIRONMENT from "../engine-core/static/ENVIRONMENT";
import GridSystem from "./runtime/GridSystem";
import IconsSystem from "./runtime/IconsSystem";
import SelectedSystem from "./runtime/SelectedSystem";
import GizmoSystem from "./runtime/GizmoSystem";
import CollisionVisualizationSystem from "./runtime/CollisionVisualizationSystem";
import UIAPI from "../engine-core/lib/rendering/UIAPI";
import GPUAPI from "../engine-core/lib/rendering/GPUAPI";
import WIREFRAMEGlsl from "./shaders/WIREFRAME.glsl";
import RotationGizmo from "./lib/transformation/RotationGizmo";
import * as SELECTED from "./shaders/SELECTED.glsl"
import GRID_FRAG from "./shaders/GRID.frag";
import ICONS_SPRITE_FRAG from "./shaders/ICONS_SPRITE.frag"
import ICONS_SPRITE_VERT from "./shaders/ICONS_SPRITE.vert"
import LineRenderer from "./runtime/LineRenderer";
import LINE_FRAG from "./shaders/LINE.frag";
import GizmoAPI from "./lib/GizmoAPI";
import GIZMO_TO_DEPTH_FRAG from "./shaders/GIZMO_TO_DEPTH.frag";
import ROTATION_GIZMO_VERT from "./shaders/ROTATION_GIZMO.vert";
import ROTATION_GIZMO_FRAG from "./shaders/ROTATION_GIZMO.frag";
import LINE_VERT from "./shaders/LINE.vert";
import GRID_VERT from "./shaders/GRID.vert";
import GIZMO_TO_DEPTH_VERT from "./shaders/GIZMO_TO_DEPTH.vert";

export default async function initializer() {
    UIAPI.useIframe = true


    GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.ICONS, ICONS_SPRITE_VERT, ICONS_SPRITE_FRAG)
    GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.LINE, LINE_VERT, LINE_FRAG)
    GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.TO_BUFFER, GIZMO_TO_DEPTH_VERT, GIZMO_TO_DEPTH_FRAG)
    GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.GIZMO, gizmoShaderCode.vertex, gizmoShaderCode.fragment)

    CollisionVisualizationSystem.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.WIREFRAME, WIREFRAMEGlsl.vertex, WIREFRAMEGlsl.fragment)
    RotationGizmo.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.ROTATION_GIZMO, ROTATION_GIZMO_VERT, ROTATION_GIZMO_FRAG)
    GridSystem.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.GRID, GRID_VERT, GRID_FRAG)
    GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.SILHOUETTE_OUTLINE, SELECTED.vertexSilhouette, SELECTED.fragmentSilhouette)
    SelectedSystem.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.SILHOUETTE, SELECTED.vertex, SELECTED.fragment)


    try{
        const res = await fetch("./STATIC_GIZMO_DATA.json")
        const {TRANSLATION_MESH, ROTATION_MESH, SCALE_MESH, DUAL_AXIS_MESH, ICON_IMG} = await res.json()
        GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.DUAL_AXIS_GIZMO, DUAL_AXIS_MESH)
        GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.ROTATION_GIZMO, ROTATION_MESH)
        GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.SCALE_GIZMO, SCALE_MESH)
        GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.TRANSLATION_GIZMO, TRANSLATION_MESH)
        IconsSystem.iconsTexture = (await GPUAPI.allocateTexture(ICON_IMG, STATIC_TEXTURES.ICONS)).texture
    }catch (err){
        console.error(err)
    }

    Engine.environment = ENVIRONMENT.DEV

    CollisionVisualizationSystem.initialize()
    GridSystem.initialize()
    IconsSystem.initialize()
    SelectedSystem.initialize()
    GizmoSystem.initialize()
    GizmoAPI.initialize()
    LineRenderer.initialize()



}