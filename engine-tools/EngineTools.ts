import GridSystem from "./runtime/GridSystem"
import IconsSystem from "./runtime/IconsSystem"
import GizmoSystem from "./runtime/GizmoSystem"
import SelectedSystem from "./runtime/SelectedSystem"
import Engine from "../engine-core/Engine";
import CameraTracker from "./lib/CameraTracker";
import WireframeRenderer from "./runtime/WireframeRenderer";
import SettingsStore from "../frontend/views/editor/stores/SettingsStore";

import ENVIRONMENT from "../engine-core/static/ENVIRONMENT";
import LineRenderer from "./runtime/LineRenderer";
import Entity from "../engine-core/instances/Entity";
import GPU from "../engine-core/GPU";
import StaticEditorMeshes from "./lib/StaticEditorMeshes";
import StaticEditorShaders from "./lib/StaticEditorShaders";
import StaticShaders from "../engine-core/lib/StaticShaders";
import Shader from "../engine-core/instances/Shader";


let settings
let selected: Entity[]
export default class EngineTools {
    static selected: Entity[] = []
    static selectionMap = new Map<string, boolean>()
    static #initialized = false

    static async initialize() {
        if (EngineTools.#initialized)
            return

        EngineTools.#initialized = true;


        // TODO - ONLY DEV
        // @ts-ignore
        window.devMapper = StaticEditorShaders;
        // @ts-ignore
        window.createInstance = (vertex, fragment) => new Shader(vertex, fragment);
        // @ts-ignore
        window.prodMapper = StaticShaders;
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
            entity.__isSelected = false
        }

        EngineTools.selected.length = 0
        data.forEach(d => {
            const entity = Engine.entities.map.get(d)
            if (entity !== undefined) {
                EngineTools.selected.push(entity)
                entity.__isSelected = true
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

    static execute() {
        CameraTracker.updateFrame()
        settings = SettingsStore.data
        const context = GPU.context
        SelectedSystem.drawToBuffer(selected)

        context.clear(context.DEPTH_BUFFER_BIT)
        context.disable(context.CULL_FACE)
        context.disable(context.DEPTH_TEST)
        if (settings.showGrid)
            GridSystem.execute()
        if (settings.showOutline)
            WireframeRenderer.execute(settings)
        SelectedSystem.drawSilhouette(selected, settings)
        IconsSystem.drawIcons(settings)
        context.enable(context.DEPTH_TEST)
        context.clear(context.DEPTH_BUFFER_BIT)
        GizmoSystem.execute()
        context.enable(context.CULL_FACE)
    }
}