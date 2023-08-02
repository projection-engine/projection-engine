import GridSystem from "./systems/GridSystem"
import IconsSystem from "./systems/IconsSystem"
import GizmoSystem from "./systems/GizmoSystem"
import SelectedSystem from "./systems/SelectedSystem"
import Engine from "../core/Engine"
import EditorCameraSystem from "./systems/EditorCameraSystem"
import WireframeSystem from "./systems/WireframeSystem"
import ENVIRONMENT from "../core/static/ENVIRONMENT"
import LineRenderer from "./systems/LineRenderer"
import Entity from "../core/instances/Entity"
import GPU from "../core/GPU"
import StaticEditorMeshes from "./utils/StaticEditorMeshes"
import StaticEditorShaders from "./utils/StaticEditorShaders"
import StaticFBO from "../core/lib/StaticFBO"
import GizmoState from "./gizmo/util/GizmoState"
import StaticEditorFBO from "./utils/StaticEditorFBO";
import GPUUtil from "../core/utils/GPUUtil";
import ConversionAPI from "../core/lib/math/ConversionAPI";
import EngineToolsState from "./EngineToolsState";
import SystemManager from "../core/SystemManager";
import SilhouetteSystem from "./systems/SilhouetteSystem";
import MouseCoordinateSystem from "./systems/MouseCoordinateSystem";
import ClearContextSystem from "./systems/ClearContextSystem";
import GizmoLineSystem from "./systems/GizmoLineSystem";

export default class EngineTools {
    static selected: Entity[] = []
    static #initialized = false

    static async initialize() {
        if (EngineTools.#initialized)
            return

        EngineTools.#initialized = true
        StaticEditorShaders.initialize()
        await StaticEditorMeshes.initialize()

        Engine.environment = ENVIRONMENT.DEV
        LineRenderer.initialize()
        StaticEditorFBO.initialize()
    }

    static onMouseMove(event: MouseEvent) {
        EngineToolsState.unconvertedMouseCoordinates[0] = event.clientX
        EngineToolsState.unconvertedMouseCoordinates[1] = event.clientY
    }

    static updateSelectionData(data: string[]) {
        const selected = EngineTools.selected
        for (let i = 0; i < selected.length; i++) {
            const entity = selected[i]
            entity.__isSelected = false
        }

        selected.length = 0
        for (let i = 0; i < data.length; i++) {
            const d = data[i]
            const entity = Engine.entities.get(d)
            if (entity !== undefined) {
                selected.push(entity)
                entity.__isSelected = true
            }
        }

        GizmoState.mainEntity = selected[0]
    }

    static drawIconsToBuffer() {
        GPU.context.disable(GPU.context.DEPTH_TEST)
        StaticFBO.visibility.use()
        StaticEditorShaders.iconToDepth.bind()
        GPUUtil.bind2DTextureForDrawing(StaticEditorShaders.iconToDepthUniforms.image, 0, IconsSystem.iconsTexture)
        IconsSystem.loop(IconsSystem.drawIcon, StaticEditorShaders.iconToDepthUniforms)
        StaticFBO.visibility.stopMapping()
        GPU.context.enable(GPU.context.DEPTH_TEST)
    }

    static #loop() {

        EditorCameraSystem.updateFrame()
        SelectedSystem.drawToBuffer()
        EngineTools.#setContextState()
        GridSystem.execute()
        WireframeSystem.execute()
        SelectedSystem.drawSilhouette()
        IconsSystem.execute()
        GizmoSystem.execute()
    }

    static bindSystems() {
        const manager = SystemManager.getInstance()
        manager.enableSystem(MouseCoordinateSystem)
        manager.enableSystem(EditorCameraSystem)
        manager.enableSystem(SelectedSystem)
        manager.enableSystem(ClearContextSystem)
        manager.enableSystem(GridSystem)
        manager.enableSystem(WireframeSystem)
        manager.enableSystem(SilhouetteSystem)
        manager.enableSystem(IconsSystem)
        manager.enableSystem(GizmoSystem)
        manager.enableSystem(GizmoLineSystem)
    }

    static unbindSystems() {
        const manager = SystemManager.getInstance()
        manager.disableSystem(EditorCameraSystem)
        manager.disableSystem(SelectedSystem)
        manager.disableSystem(EngineTools)
        manager.disableSystem(GridSystem)
        manager.disableSystem(WireframeSystem)
        manager.disableSystem(SelectedSystem)
        manager.disableSystem(IconsSystem)
        manager.disableSystem(GizmoSystem)
    }

}
