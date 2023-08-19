import GridSystem from "./systems/GridSystem"
import IconsSystem from "./systems/IconsSystem"
import GizmoSystem from "./systems/GizmoSystem"
import SelectedSystem from "./systems/SelectedSystem"
import Engine from "../core/Engine"
import EditorCameraSystem from "./systems/EditorCameraSystem"
import WireframeSystem from "./systems/WireframeSystem"
import LineRenderer from "./systems/LineRenderer"
import EditorEntity from "./EditorEntity"
import GPU from "../core/GPU"
import StaticEditorMeshes from "./utils/StaticEditorMeshes"
import StaticEditorShaders from "./utils/StaticEditorShaders"
import StaticFBOState from "@engine-core/states/StaticFBOState"
import GizmoState from "./gizmo/util/GizmoState"
import StaticEditorFBO from "./utils/StaticEditorFBO";
import GPUUtil from "../core/utils/GPUUtil";
import EngineToolsState from "./EngineToolsState";
import SystemManager from "@engine-core/managers/SystemManager";
import SilhouetteSystem from "./systems/SilhouetteSystem";
import MouseCoordinateSystem from "./systems/MouseCoordinateSystem";
import ClearContextSystem from "./systems/ClearContextSystem";
import GizmoLineSystem from "./systems/GizmoLineSystem";
import EditorCameraGizmoSystem from "./systems/EditorCameraGizmoSystem";
import CameraIconSystem from "./systems/CameraIconSystem";
import {Environment,} from "@engine-core/engine.enum";
import EditorEntityManager from "./EditorEntityManager";

export default class EngineTools {
    static selected: EditorEntity[] = []
    static #initialized = false

    static async initialize() {
        if (EngineTools.#initialized)
            return

        EngineTools.#initialized = true
        StaticEditorShaders.initialize()
        await StaticEditorMeshes.initialize()

        Engine.environment = Environment.DEV
        LineRenderer.initialize()
        StaticEditorFBO.initialize()
    }

    static onMouseMove(event: MouseEvent) {
        EngineToolsState.unconvertedMouseCoordinates[0] = event.clientX
        EngineToolsState.unconvertedMouseCoordinates[1] = event.clientY
    }

    static updateSelectionData(data: EngineEntity[]) {
        const selected = EngineTools.selected
        for (let i = 0; i < selected.length; i++) {
            const entity = selected[i]
            entity.__isSelected = false
        }

        selected.length = 0
        for (let i = 0; i < data.length; i++) {
            const d = data[i]
            const entity = EditorEntityManager.getEntity(d)
            if (entity !== undefined) {
                selected.push(entity)
                entity.__isSelected = true
            }
        }

        GizmoState.mainEntity = selected[0]
    }

    static drawIconsToBuffer() {
        GPU.context.disable(GPU.context.DEPTH_TEST)
        StaticFBOState.visibility.use()
        StaticEditorShaders.iconToDepth.bind()
        GPUUtil.bind2DTextureForDrawing(StaticEditorShaders.iconToDepthUniforms.image, 0, IconsSystem.iconsTexture)
        IconsSystem.loop(IconsSystem.drawIcon, StaticEditorShaders.iconToDepthUniforms)
        StaticFBOState.visibility.stopMapping()
        GPU.context.enable(GPU.context.DEPTH_TEST)
    }

    static bindSystems() {
        const manager = SystemManager.getInstance()
        manager.enableSystem(MouseCoordinateSystem)
        manager.enableSystem(EditorCameraSystem)
        manager.enableSystem(SelectedSystem)
        manager.enableSystem(ClearContextSystem)
        manager.enableSystem(GridSystem)
        manager.enableSystem(WireframeSystem)
        manager.enableSystem(CameraIconSystem)
        manager.enableSystem(SilhouetteSystem)
        manager.enableSystem(IconsSystem)
        manager.enableSystem(GizmoSystem)
        manager.enableSystem(GizmoLineSystem)
        manager.enableSystem(EditorCameraGizmoSystem)

    }

    static unbindSystems() {
        const manager = SystemManager.getInstance()
        manager.disableSystem(MouseCoordinateSystem)
        manager.disableSystem(EditorCameraSystem)
        manager.disableSystem(SelectedSystem)
        manager.disableSystem(ClearContextSystem)
        manager.disableSystem(GridSystem)
        manager.disableSystem(WireframeSystem)
        manager.disableSystem(CameraIconSystem)
        manager.disableSystem(SilhouetteSystem)
        manager.disableSystem(IconsSystem)
        manager.disableSystem(GizmoSystem)
        manager.disableSystem(GizmoLineSystem)
        manager.disableSystem(EditorCameraGizmoSystem)
    }

}
