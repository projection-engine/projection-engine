import GridSystem from "./runtime/GridSystem"
import IconsSystem from "./runtime/IconsSystem"
import GizmoSystem from "./runtime/GizmoSystem"
import SelectedSystem from "./runtime/SelectedSystem"
import Engine from "../engine-core/Engine";
import CameraTracker from "./lib/CameraTracker";
import CollisionVisualizationSystem from "./runtime/CollisionVisualizationSystem";
import SettingsStore from "../frontend/editor/stores/SettingsStore";
import UIAPI from "../engine-core/lib/rendering/UIAPI";
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
import ENVIRONMENT from "../engine-core/static/ENVIRONMENT";
import LineRenderer from "./runtime/LineRenderer";
import Entity from "../engine-core/instances/Entity";
import GPU from "../engine-core/GPU";
import StaticEditorMeshes from "./lib/StaticEditorMeshes";
import StaticEditorShaders from "./lib/StaticEditorShaders";


let settings
let selected: Entity[]
export default class EngineTools {
    static selected: Entity[] = []
    static selectionMap = new Map<string, boolean>()
    static #initialized = false

    static async initialize() {
        if (EngineTools.#initialized)
            return
        EngineTools.#initialized = true
        UIAPI.useIframe = true
        StaticEditorShaders.initialize()
        await StaticEditorMeshes.initialize()

        Engine.environment = ENVIRONMENT.DEV

        GridSystem.initialize()
        GizmoSystem.initialize()
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

        GPU.context.disable(GPU.context.CULL_FACE)
        GPU.context.disable(GPU.context.DEPTH_TEST)
        if (settings.showGrid)
            GridSystem.execute()
        CollisionVisualizationSystem.execute(selected)
        SelectedSystem.drawSilhouette(selected, settings)
        IconsSystem.drawIcons(settings)
        GPU.context.enable(GPU.context.DEPTH_TEST)
        GPU.context.clear(GPU.context.DEPTH_BUFFER_BIT)

        GizmoSystem.execute()
        GPU.context.enable(GPU.context.CULL_FACE)
    }
}