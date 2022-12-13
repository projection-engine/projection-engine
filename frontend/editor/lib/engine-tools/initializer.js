import STATIC_TEXTURES from "../../../../public/engine/static/resources/STATIC_TEXTURES";
import circle from "../../static/icons/circle.png";
import STATIC_SHADERS from "../../../../public/engine/static/resources/STATIC_SHADERS";
import * as gizmoShaderCode from "./shaders/GIZMO.glsl";
import STATIC_MESHES from "../../../../public/engine/static/resources/STATIC_MESHES";
import PLANE from "./static/DUAL_AXIS_GIZMO.json";
import ROTATION_GIZMO from "./static/ROTATION_GIZMO.json";
import SCALE_GIZMO from "./static/SCALE_GIZMO.json";
import TRANSLATION_GIZMO from "./static/TRANSLATION_GIZMO.json";
import Engine from "../../../../public/engine/Engine";
import ENVIRONMENT from "../../../../public/engine/static/ENVIRONMENT";
import GridSystem from "./runtime/GridSystem";
import IconsSystem from "./runtime/IconsSystem";
import SelectedSystem from "./runtime/SelectedSystem";
import GizmoSystem from "./runtime/GizmoSystem";
import CollisionVisualizationSystem from "./runtime/CollisionVisualizationSystem";
import UIAPI from "../../../../public/engine/lib/rendering/UIAPI";
import GPUAPI from "../../../../public/engine/lib/rendering/GPUAPI";
import WIREFRAMEGlsl from "./shaders/WIREFRAME.glsl";
import RotationGizmo from "./lib/transformation/RotationGizmo";
import * as SELECTED from "./shaders/SELECTED.glsl"
import * as GRID from "./shaders/GRID.glsl";

import ICONS from "./static/ICONS.base64"
import ICONS_SPRITE_FRAG from "./shaders/ICONS_SPRITE.frag"
import ICONS_SPRITE_VERT from "./shaders/ICONS_SPRITE.vert"
import LineRenderer from "./runtime/LineRenderer";
import {lineFragment, lineVertex} from "./shaders/LINE";
import GizmoAPI from "./lib/GizmoAPI";
import {pickFragment, sameSizeVertex} from "./shaders/TO_DEPTH_BUFFER";
import {fragmentRot, vertexRot} from "./shaders/ROTATION_GIZMO";

export default async function initializer() {

    UIAPI.useIframe = true

    GPUAPI.allocateTexture(circle, STATIC_TEXTURES.ROTATION_GIZMO).catch()


    GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.ICONS, ICONS_SPRITE_VERT, ICONS_SPRITE_FRAG)
    GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.LINE, lineVertex, lineFragment)
    GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.TO_BUFFER, sameSizeVertex, pickFragment)
    GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.GIZMO, gizmoShaderCode.vertex, gizmoShaderCode.fragment)

    CollisionVisualizationSystem.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.WIREFRAME, WIREFRAMEGlsl.vertex, WIREFRAMEGlsl.fragment)
    RotationGizmo.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.ROTATION_GIZMO, vertexRot, fragmentRot)
    GridSystem.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.GRID, GRID.vertex, GRID.fragment)
    GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.SILHOUETTE_OUTLINE, SELECTED.vertexSilhouette, SELECTED.fragmentSilhouette)
    SelectedSystem.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.SILHOUETTE, SELECTED.vertex, SELECTED.fragment)

    GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.DUAL_AXIS_GIZMO, PLANE)
    GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.ROTATION_GIZMO, ROTATION_GIZMO)
    GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.SCALE_GIZMO, SCALE_GIZMO)
    GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.TRANSLATION_GIZMO, TRANSLATION_GIZMO)

    Engine.environment = ENVIRONMENT.DEV

    CollisionVisualizationSystem.initialize()
    GridSystem.initialize()
    IconsSystem.initialize()
    SelectedSystem.initialize()
    GizmoSystem.initialize()
    GizmoAPI.initialize()
    LineRenderer.initialize()

    GPUAPI.allocateTexture(ICONS, STATIC_TEXTURES.ICONS).then(texture => {
        IconsSystem.iconsTexture = texture.texture
    })


}