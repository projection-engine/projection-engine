import GridSystem from "./runtime/GridSystem"
import IconsSystem from "./runtime/IconsSystem"
import GizmoSystem from "./runtime/GizmoSystem"
import SelectedSystem from "./runtime/SelectedSystem"
import Engine from "../engine-core/Engine";
import CameraTracker from "./lib/CameraTracker";
import CollisionVisualizationSystem from "./runtime/CollisionVisualizationSystem";
import SettingsStore from "../frontend/editor/stores/SettingsStore";
import UIAPI from "../engine-core/lib/rendering/UIAPI";
import GPUAPI from "../engine-core/lib/rendering/GPUAPI";
import STATIC_SHADERS from "../engine-core/static/resources/STATIC_SHADERS";
// @ts-ignore
import ICONS_SPRITE_VERT from "./shaders/ICONS_SPRITE.vert";
// @ts-ignore
import ICONS_SPRITE_FRAG from "./shaders/ICONS_SPRITE.frag";
// @ts-ignore
import LINE_VERT from "./shaders/LINE.vert";
// @ts-ignore
import LINE_FRAG from "./shaders/LINE.frag";
// @ts-ignore
import GIZMO_TO_DEPTH_VERT from "./shaders/GIZMO_TO_DEPTH.vert";
// @ts-ignore
import GIZMO_TO_DEPTH_FRAG from "./shaders/GIZMO_TO_DEPTH.frag";
// @ts-ignore
import GIZMO_VERT from "./shaders/GIZMO.vert";
// @ts-ignore
import GIZMO_FRAG from "./shaders/GIZMO.frag";
// @ts-ignore
import WIREFRAME_VERT from "./shaders/WIREFRAME.vert";
// @ts-ignore
import WIREFRAME_FRAG from "./shaders/WIREFRAME.frag";
import RotationGizmo from "./lib/transformation/RotationGizmo";
// @ts-ignore
import ROTATION_GIZMO_VERT from "./shaders/ROTATION_GIZMO.vert";
// @ts-ignore
import ROTATION_GIZMO_FRAG from "./shaders/ROTATION_GIZMO.frag";
// @ts-ignore
import GRID_VERT from "./shaders/GRID.vert";
// @ts-ignore
import GRID_FRAG from "./shaders/GRID.frag";
// @ts-ignore
import SILHOUETTE_VERT from "./shaders/SILHOUETTE.vert";
// @ts-ignore
import SILHOUETTE_FRAG from "./shaders/SILHOUETTE.frag";
// @ts-ignore
import MESH_MAP_VERT from "./shaders/MESH_MAP.vert";
// @ts-ignore
import MESH_MAP_FRAG from "./shaders/MESH_MAP.frag";
import STATIC_MESHES from "../engine-core/static/resources/STATIC_MESHES";
import STATIC_TEXTURES from "../engine-core/static/resources/STATIC_TEXTURES";
import ENVIRONMENT from "../engine-core/static/ENVIRONMENT";
import GizmoAPI from "./lib/GizmoAPI";
import LineRenderer from "./runtime/LineRenderer";
import Controller from "../engine-core/lib/Controller";
import Entity from "../engine-core/instances/Entity";


let settings
let selected:Entity[]
export default class EngineTools extends Controller {
    static selected: Entity[] = []
    static selectionMap = new Map<string, boolean>()

    static async initialize(): Promise<void> {
        super.initialize()

        UIAPI.useIframe = true
        GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.ICONS, ICONS_SPRITE_VERT, ICONS_SPRITE_FRAG)
        GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.LINE, LINE_VERT, LINE_FRAG)
        GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.TO_BUFFER, GIZMO_TO_DEPTH_VERT, GIZMO_TO_DEPTH_FRAG)
        GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.GIZMO, GIZMO_VERT, GIZMO_FRAG)

        CollisionVisualizationSystem.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.WIREFRAME, WIREFRAME_VERT, WIREFRAME_FRAG)
        RotationGizmo.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.ROTATION_GIZMO, ROTATION_GIZMO_VERT, ROTATION_GIZMO_FRAG)
        GridSystem.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.GRID, GRID_VERT, GRID_FRAG)
        GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.SILHOUETTE_OUTLINE, SILHOUETTE_VERT, SILHOUETTE_FRAG)
        SelectedSystem.shader = GPUAPI.allocateShader(STATIC_SHADERS.DEVELOPMENT.SILHOUETTE, MESH_MAP_VERT, MESH_MAP_FRAG)

        try {
            const res = await fetch("./STATIC_GIZMO_DATA.json")
            const {TRANSLATION_MESH, ROTATION_MESH, SCALE_MESH, DUAL_AXIS_MESH, ICON_IMG} = await res.json()
            GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.DUAL_AXIS_GIZMO, DUAL_AXIS_MESH)
            GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.ROTATION_GIZMO, ROTATION_MESH)
            GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.SCALE_GIZMO, SCALE_MESH)
            GPUAPI.allocateMesh(STATIC_MESHES.EDITOR.TRANSLATION_GIZMO, TRANSLATION_MESH)
            IconsSystem.iconsTexture = (await GPUAPI.allocateTexture(ICON_IMG, STATIC_TEXTURES.ICONS)).texture
        } catch (err) {
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

    static updateSelectionData(data: string[]) {
        EngineTools.selectionMap.clear()

        for (let i = 0; i < EngineTools.selected.length; i++) {
            const entity = EngineTools.selected[i]
            entity.addProperty<boolean>("__isSelected", false)
        }

        EngineTools.selected.length = 0
        data.forEach(d => {
            const entity = Engine.entitiesMap.get(d)
            if (entity !== undefined) {
                EngineTools.selected.push(entity)
                entity.addProperty<boolean>("__isSelected", true)
                EngineTools.selectionMap.set(d, true)
            }
        })
        const main = EngineTools.selected[0]
        if (main)
            GizmoSystem.linkEntityToGizmo(main)
        else {
            GizmoSystem.targetRotation = undefined
            GizmoSystem.mainEntity = undefined
            GizmoSystem.hasStarted = false
        }
        selected = EngineTools.selected
    }

    static afterDrawing() {
        CameraTracker.updateFrame()
        settings = SettingsStore.data

        gpu.disable(gpu.CULL_FACE)
        gpu.disable(gpu.DEPTH_TEST)
        if (settings.showGrid)
            GridSystem.execute()
        CollisionVisualizationSystem.execute(selected)
        SelectedSystem.drawSilhouette(selected, settings)
        IconsSystem.drawIcons(settings)
        gpu.enable(gpu.DEPTH_TEST)
        gpu.clear(gpu.DEPTH_BUFFER_BIT)

        GizmoSystem.execute()
        gpu.enable(gpu.CULL_FACE)
    }
}